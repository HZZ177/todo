import { useMemo } from 'react'

import { togglePanelWindow } from '../lib/tauri'
import { useTodoStore } from '../store/todo-store'
import { useUiStore } from '../store/ui-store'

export function BallApp() {
  const selectedDate = useUiStore((state) => state.selectedDate)
  const todos = useTodoStore((state) => state.todos)

  const badge = useMemo(() => {
    const count = todos.filter((todo) => todo.date === selectedDate && !todo.completed).length
    return count > 0 ? `${count}` : '0'
  }, [selectedDate, todos])

  return (
    <main className="ball-shell">
      <button type="button" className="ball-button" aria-label="展开待办面板" onClick={() => void togglePanelWindow()}>
        <span className="ball-button__label">待办</span>
        <strong>{badge}</strong>
      </button>
    </main>
  )
}
