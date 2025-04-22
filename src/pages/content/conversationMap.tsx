import SummaryLine from "@pages/content/summaryLine";
import {MouseEvent, useState} from "react";
import {Message} from "@pages/types";
import MessageBlock from "@pages/content/MessageBlock";

export default function ConversationMap() {
  const [shapeStyle, setShapeStyle] = useState('w-60 h-96')
  const [messages, setMessages] = useState<Message[]>([
    {
      from: 'ai',
      content: 'hi how can I help you'
    },
    {
      from: 'user',
      content: 'I want you to help me solve problems'
    }
  ])
  const [collapse, setCollapse] = useState<boolean>(false)
  const onMouseEnter = (e: MouseEvent) => {
    e.preventDefault()
    setShapeStyle('w-60 h-96')
    setCollapse(false)
  }

  const onMouseLeave = (e: MouseEvent) => {
    e.preventDefault()
    setShapeStyle('w-32 h-56')
    setCollapse(true)
  }
  return (
    <div className={`${shapeStyle} border rounded-md border-gray-100`}
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