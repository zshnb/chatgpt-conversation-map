import SummaryLine from "@pages/content/summaryLine";
import {MouseEvent, useEffect, useState} from "react";
import {Message} from "@pages/types";
import MessageBlock from "@pages/content/MessageBlock";

export default function ConversationMap() {
  const [messages, setMessages] = useState<Message[]>([])
  const [conversationId, setConversationId] = useState<string>('')

  useEffect(() => {
    chrome.runtime.sendMessage({
      type: 'getMessages'
    }).then((res: Message[]) => {
      console.log(res)
      setMessages(res.filter(it => it.content !== '' && it.from === 'ai'))
    })
  }, [conversationId])

  useEffect(() => {
    chrome.runtime.onMessage.addListener((request: {conversationId: string}) => {
      setConversationId(request.conversationId)
    })
  }, []);
  const [collapse, setCollapse] = useState<boolean>(true)
  const onMouseEnter = (e: MouseEvent) => {
    e.preventDefault()
    setCollapse(false)
  }

  const onMouseLeave = (e: MouseEvent) => {
    e.preventDefault()
    setCollapse(true)
  }
  return (
    <div className={`w-32 h-56 hover:w-60 hover:h-96 border rounded-md border-gray-100 overflow-auto transition-all duration-200 ease-in-out`}
         onMouseEnter={onMouseEnter}
         onMouseLeave={onMouseLeave}
    >
      {
        collapse ? (
          <ul className={'space-y-3 p-2'}>
            <SummaryLine/>
          </ul>
        ) : <MessageBlock messages={messages}/>
      }
    </div>
  )
}