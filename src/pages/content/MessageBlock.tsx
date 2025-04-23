import {Message} from "@pages/types";

export type MessageBlockProps = {
  messages: Message[];
}
export default function MessageBlock({messages}: MessageBlockProps) {

  return (
    <div className={'space-y-4 p-3'}>
      {messages.map((message, index) => (<MessageLine key={index} message={message}/>))}
    </div>
  )
}

type MessageLineProps = {
  message: Message
}
function MessageLine({message}: MessageLineProps) {
  const handleClick = () => {
    const targetElement = document.querySelector(`[data-message-id="${message.id}"]`);

    if (targetElement) {
      // 平滑滚动到目标元素
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  const textColor: string = message.from === 'ai' ? 'bg-gray-200 text-gray-800' : 'bg-blue-500 text-white'
  return (
    <div className={`flex ${message.from === 'ai' ? 'justify-start': 'justify-end'}`}>
      <div className={`max-w-3/5 max-h-10 overflow-auto ${textColor} p-1 rounded-lg cursor-pointer`} onClick={handleClick}>
        <p className={'text-xs break-all'}>{message.content}</p>
      </div>
    </div>
  )
}