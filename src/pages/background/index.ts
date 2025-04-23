import {ChatGPTConversationMapping, ChatGPTConversationResponse, Message} from "@pages/types";

console.log('background script loaded');
chrome.webRequest.onSendHeaders.addListener(async (details) => {
  const url = details.url
  const conversationId = getConversationId()

  const headers = details.requestHeaders
  const auth = headers?.find(it => it.name === 'Authorization') || ''
  if (!auth || !conversationId) {
    return
  }

  const jwt = auth.value
  await chrome.storage.local.set({ jwt, conversationId })

  function getConversationId() {
    const pattern = /(?<=conversation\/).{36}/
    const matchResult = pattern.exec(url)
    if (matchResult) {
      return matchResult[0]
    } else {
      return undefined
    }
  }
}, {urls: ['https://chatgpt.com/backend-api/conversation/*']}, ['requestHeaders'])

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('received request', request);
  if (request.type === 'getMessages') {
    handleGetMessages(sendResponse)
  }
  return true
})

async function handleGetMessages(sendResponse: (response: unknown) => void) {
  const {jwt, conversationId} = await chrome.storage.local.get<{jwt: string, conversationId: string}>(['jwt', 'conversationId'])
  const messages = await getMessages(conversationId, jwt)
  sendResponse(messages)
}

export async function getMessages(conversationId: string, jwt: string) {
  const response = await fetch(`https://chatgpt.com/backend-api/conversation/${conversationId}`, {
    method: 'GET',
    headers: {
      Authorization: jwt,
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
    }
  })
  if (!response.ok) {
    console.log('get conversation error')
    return []
  }

  const messages: Message[] = []
  const conversationResponse = (await response.json()) as ChatGPTConversationResponse
  const godMessage = Object.values(conversationResponse.mapping).find((it: ChatGPTConversationMapping) => it.parent === null)
  if (!godMessage) {
    return []
  }

  let currentMessage = getNextAssistantMessage(godMessage)
  messages.push({
    id: currentMessage.message.id,
    from: currentMessage.message.author.role === 'assistant' ? 'ai' : 'user',
    content: currentMessage.message.content.parts[0].replaceAll('\n', '')
  })
  while (currentMessage.children.length > 0) {
    currentMessage = getNextAssistantMessage(currentMessage)
    if (currentMessage.message.author.role === 'tool') {
      continue
    }
    messages.push({
      id: currentMessage.message.id,
      from: currentMessage.message.author.role === 'assistant' ? 'ai' : 'user',
      content: currentMessage.message.content.parts[0].replaceAll('\n', '')
    })
  }

  function getNextAssistantMessage(parentMessage: ChatGPTConversationMapping): ChatGPTConversationMapping {
    let childMessageId = parentMessage.children[0]
    while (true) {
      const childMessage = conversationResponse.mapping[childMessageId]
      if (childMessage.message.content.content_type === 'text') {
        return childMessage
      } else {
        childMessageId = childMessage.children[0]
      }
    }
  }
  return messages
}