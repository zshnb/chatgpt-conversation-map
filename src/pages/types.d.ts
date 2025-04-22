export type Message = {
  content: string
  from: MessageFrom
}

export type MessageFrom = 'ai' | 'user'