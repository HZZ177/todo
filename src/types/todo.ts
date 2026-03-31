export type TodoItem = {
  id: string
  title: string
  date: string
  time?: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

export type WindowPosition = {
  x: number
  y: number
}

export type StoredData = {
  todos: TodoItem[]
  windowPosition: WindowPosition | null
}
