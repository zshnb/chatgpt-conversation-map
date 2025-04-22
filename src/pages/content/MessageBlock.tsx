import {Message} from "@pages/types";

export type MessageBlockProps = {
  messages: Message[];
}
export default function MessageBlock({messages}: MessageBlockProps) {

  return (
    <div className={'space-y-4 p-3 scroll-auto'}>
      {messages.map((message, index) => (<MessageLine key={index} message={message}/>))}
    </div>
  )
}

type MessageLineProps = {
  message: Message
}
function MessageLine({message}: MessageLineProps) {
  const textColor: string = message.from === 'ai' ? 'bg-gray-200 text-gray-800' : 'bg-blue-500 text-white'
  return (
    <div className={`flex ${message.from === 'ai' ? 'justify-start': 'justify-end'}`}>
      <div className={`max-w-3/5 ${textColor} p-1 rounded-lg`}>
        <p className={'text-sm break-all'}>{message.content}</p>
      </div>
    </div>
  )
}