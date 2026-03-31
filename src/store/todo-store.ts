import dayjs from 'dayjs'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { emitTodoDataChanged } from '../lib/window-events'
import type { TodoItem } from '../types/todo'

type TodoInput = {
  title: string
  date: string
  time?: string
}

type TodoState = {
  todos: TodoItem[]
  addTodo: (input: TodoInput) => void
  toggleTodo: (id: string) => void
  getTodosByDate: (date: string) => TodoItem[]
}

const sortTodos = (todos: TodoItem[]) =>
  [...todos].sort((a, b) => {
    if (!a.time && !b.time) return a.createdAt.localeCompare(b.createdAt)
    if (!a.time) return 1
    if (!b.time) return -1
    return a.time.localeCompare(b.time)
  })

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      todos: [],
      addTodo: ({ title, date, time }) => {
        const now = dayjs().toISOString()
        const todo: TodoItem = {
          id: crypto.randomUUID(),
          title: title.trim(),
          date,
          time: time || undefined,
          completed: false,
          createdAt: now,
          updatedAt: now,
        }

        set((state) => ({
          todos: sortTodos([...state.todos, todo]),
        }))
        void emitTodoDataChanged()
      },
      toggleTodo: (id) => {
        set((state) => ({
          todos: sortTodos(
            state.todos.map((todo) =>
              todo.id === id
                ? {
                    ...todo,
                    completed: !todo.completed,
                    updatedAt: dayjs().toISOString(),
                  }
                : todo,
            ),
          ),
        }))
        void emitTodoDataChanged()
      },
      getTodosByDate: (date) => get().todos.filter((todo) => todo.date === date),
    }),
    {
      name: 'todo-desktop-todos',
    },
  ),
)

export const getMonthSummary = (todos: TodoItem[], month: string) => {
  const targetMonth = dayjs(month)
  return todos.reduce<Record<string, number>>((acc, todo) => {
    if (dayjs(todo.date).isSame(targetMonth, 'month')) {
      acc[todo.date] = (acc[todo.date] ?? 0) + 1
    }
    return acc
  }, {})
}

export const getTimelineGroups = (todos: TodoItem[]) => {
  const scheduled = todos.filter((todo) => todo.time)
  const unscheduled = todos.filter((todo) => !todo.time)

  return {
    scheduled: sortTodos(scheduled),
    unscheduled: sortTodos(unscheduled),
  }
}
