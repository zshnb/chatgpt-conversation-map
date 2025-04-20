export default function SummaryLine() {
  return (
    <>
      {
        [0,1,2].map(() => (
          <>
            <li
              className="relative text-gray-700 before:absolute before:left-0
                     before:top-1/2 before:-translate-y-1/2 before:h-0.5 before:bg-gray-400 before:w-full">
              <br/>
            </li>
            <li
              className="relative text-gray-700 before:absolute before:left-0
                     before:top-1/2 before:-translate-y-1/2 before:h-0.5 before:bg-gray-400 before:w-4/5">
              <br/>
            </li>
          </>
        ))
      }
    </>
  )
}