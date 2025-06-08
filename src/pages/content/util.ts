import {PhrasingContent} from "mdast";

export function getHeadingContent(children: PhrasingContent[]) {
  let content = ''
  for (const child of children) {
    if (child.type === 'text' || child.type === 'inlineCode') {
      content += child.value
    } else {
      if (child.type === 'strong' || child.type === 'link' || child.type === 'emphasis')
      content += getHeadingContent(child.children)
    }
  }

  return content
}