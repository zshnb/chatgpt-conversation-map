import SummaryLine from "@pages/content/summaryLine";
import {MouseEvent, useEffect, useState} from "react";
import {Message} from "@pages/types";
import MessageBlock from "@pages/content/MessageBlock";

export default function ConversationMap() {
  const [messages, setMessages] = useState<Message[]>([])
  const [conversationId, setConversationId] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    chrome.runtime.sendMessage({
      type: 'getMessages',
      conversationId
    }).then((res: Message[]) => {
      console.log('get message result', res)
      setLoading(false)
      setMessages(res.filter(it => it.content !== '' && it.from === 'ai'))
    })
  }, [conversationId])

  useEffect(() => {
    chrome.runtime.onMessage.addListener((request: {conversationId: string}) => {
      console.log('set conversationId', request)
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
		<div
			className={`
      w-32 h-56 hover:w-60 hover:h-96 border rounded-md border-gray-100 
      overflow-auto transition-all duration-200 ease-in-out dark:bg-[#212121] dark:text-white`}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			{collapse ? (
				<ul className={'space-y-3 p-2'}>
					<SummaryLine />
				</ul>
			) : (
				<MessageBlock messages={messages} loading={loading}/>
			)}
		</div>
	);
}