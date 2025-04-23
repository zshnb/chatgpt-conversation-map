export type Message = {
  id: string
  content: string
  from: MessageFrom
}

export type MessageFrom = 'ai' | 'user'

export type ChatGPTConversationResponse = {
  mapping: {
    [key: string]: ChatGPTConversationMapping
  }
}

export type ChatGPTConversationMapping = {
  id: string
  parent: string | null
  message: {
    id: string
    author: {
      role: 'user' | 'assistant' | 'tool'
    }
    content: {
      content_type: string
      parts: string[]
    }
  }
  children: string[]
}