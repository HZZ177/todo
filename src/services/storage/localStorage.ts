import type { StoredData } from '../../types/todo'

const STORAGE_KEY = 'todo-desktop-store'

const defaultData: StoredData = {
  todos: [],
  windowPosition: null,
}

export function readStorage(): StoredData {
  if (typeof window === 'undefined') {
    return defaultData
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return defaultData
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredData>
    return {
      todos: Array.isArray(parsed.todos) ? parsed.todos : [],
      windowPosition: parsed.windowPosition ?? null,
    }
  } catch {
    return defaultData
  }
}

export function writeStorage(data: StoredData) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
