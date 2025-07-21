import {Message} from "@pages/types";
import {fromMarkdown} from "mdast-util-from-markdown";
import {Heading, Paragraph} from "mdast";
import _, {isEmpty} from "lodash";
import {getHeadingContent, getParagraphContent} from "@pages/content/util";
import Spinner from "@pages/components/spinner";

export type MessageBlockProps = {
  messages: Message[];
  loading: boolean
}
export default function MessageBlock({messages, loading}: MessageBlockProps) {
  return (
		<div className={'space-y-1 p-2'}>
			{loading ? (
				<>
					<Spinner />
					<p className="text-center text-sm">{chrome.i18n.getMessage('contentRefresh')}</p>
				</>
			) : isEmpty(messages) ? (
				<p className="text-center text-lg">{chrome.i18n.getMessage('contentNoItems')}</p>
			) : (
				messages.map((message, index) => {
					const tree = fromMarkdown(message.content);
					const headingBlocks = tree.children.filter((child) => child.type === 'heading');
					const topLevel = headingBlocks.length > 0 ? [...headingBlocks].sort((a, b) => a.depth - b.depth)[0].depth : 0
          return tree.children.map(child => {
            switch (child.type) {
							case 'heading': {
								const heading = child;
								const headingContent = getHeadingContent(heading.children);
								const htmlElement = document
									.querySelectorAll(`div#thread h${heading.depth}`)
									.values()
									.find((it) => it.textContent === headingContent) as HTMLElement | undefined;
								return (
									<MessageLine
										key={index}
										element={htmlElement}
										nodeContent={headingContent}
										indentLevel={heading.depth - topLevel}
										topLevel={topLevel}
										node={heading}
									/>
								);
							}
							case 'paragraph': {
								const paragraph = child;
								if (paragraph.children.length === 1 && paragraph.children[0].type === 'strong') {
									const content = getParagraphContent(paragraph.children);
									const paragraphElement = document
										.querySelectorAll(`div#thread strong`)
										.values()
										.find((it) => it.textContent === content) as HTMLElement | undefined;
									return (
										<MessageLine
											key={index}
											nodeContent={content}
											indentLevel={0}
											topLevel={0}
											node={paragraph}
											element={paragraphElement}
										/>
									);
								} else {
									return undefined;
								}
							}
							// case 'list': {
							//   break
							// }
							default: {
                return undefined
							}
						}
          }).filter(it => it !== undefined).flat()
				})
			)}
		</div>
	);
}

type MessageLineProps = {
  topLevel: number
  indentLevel: number
  node: Heading | Paragraph
  nodeContent: string
  element?: HTMLElement
}

function MessageLine({node, nodeContent, topLevel, indentLevel, element}: MessageLineProps) {
  const handleClick = () => {
    if (element) {
      element.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  }

  const margin = 'depth' in node && node.depth === topLevel ? 0 : `${10 * indentLevel}px`
  return (
    <p className={`text-xs ${margin} hover:cursor-pointer hover:bg-[#d6d6d6] dark:hover:bg-gray-500
     hover:rounded-md p-2 `}
       style={{marginLeft: margin}} onClick={handleClick}>{nodeContent}</p>
  )
}