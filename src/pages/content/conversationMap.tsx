import SummaryLine from "@pages/content/summaryLine";

export default function ConversationMap() {
  return (
    <div className={'w-32 h-56 border rounded-md border-gray-100'}>
      <ul className={'space-y-3 p-2'}>
        <SummaryLine/>
      </ul>
    </div>
  )
}