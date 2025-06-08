import {Message} from "@pages/types";
import {fromMarkdown} from "mdast-util-from-markdown";
import {Heading} from "mdast";
import _ from "lodash";
import {getHeadingContent} from "@pages/content/util";
import {Spinner} from "@heroui/react";

export type MessageBlockProps = {
  messages: Message[];
}
export default function MessageBlock({messages}: MessageBlockProps) {
  document.querySelectorAll('h3').values().forEach(it => {
    console.log('content', it.textContent)
  })
  return (
    <div className={'space-y-1 p-2'}>
      <Spinner size={'sm'}/>
      {
        messages.map((message, index) => {
          const tree = fromMarkdown(message.content)
          console.log('message markdown tree', tree)
          const headingBlocks = tree.children.filter(
            (child) => child.type === 'heading')
          if (!_.isEmpty(headingBlocks)) {
            const topLevel = [...headingBlocks].sort((a, b) => a.depth - b.depth)[0].depth
            return headingBlocks.map((heading) => {
              const headingContent = getHeadingContent(heading.children)
              const htmlElement = document.querySelectorAll(`div#thread h${heading.depth}`).values()
                .find(it => it.textContent === headingContent) as (HTMLElement | undefined)
              return <MessageLine key={index}
                                  element={htmlElement}
                                  headingContent={headingContent}
                                  indentLevel={heading.depth - topLevel}
                                  topLevel={topLevel}
                                  heading={heading}/>
            }).flat()
          } else {
            return []
          }
        })
      }
    </div>
  )
}

type MessageLineProps = {
  topLevel: number
  indentLevel: number
  heading: Heading
  headingContent: string
  element?: HTMLElement
}

function MessageLine({heading, headingContent, topLevel, indentLevel, element}: MessageLineProps) {
  const handleClick = () => {
    if (element) {
      // 平滑滚动到目标元素
      element.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  }

  const margin = heading.depth === topLevel ? 0 : `${10 * indentLevel}px`
  return (
    <p className={`text-xs ${margin} hover:cursor-pointer hover:bg-gray-200 hover:rounded-md p-2`}
       style={{marginLeft: margin}} onClick={handleClick}>{headingContent}</p>
  )
}