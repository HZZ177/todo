import { useMemo, useRef } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'

import { expandToPanel, startWindowDragging } from '../lib/tauri'
import { useTodoStore } from '../store/todo-store'
import { useUiStore } from '../store/ui-store'

const DRAG_THRESHOLD = 6

export function BallApp() {
  const selectedDate = useUiStore((state) => state.selectedDate)
  const setWindowMode = useUiStore((state) => state.setWindowMode)
  const todos = useTodoStore((state) => state.todos)
  const pressRef = useRef<{ x: number; y: number; dragging: boolean } | null>(null)

  const badge = useMemo(() => {
    const count = todos.filter((todo) => todo.date === selectedDate && !todo.completed).length
    return count > 0 ? `${count}` : '0'
  }, [selectedDate, todos])

  const handleMouseDown = (event: ReactMouseEvent<HTMLButtonElement>) => {
    pressRef.current = {
      x: event.clientX,
      y: event.clientY,
      dragging: false,
    }
  }

  const handleMouseMove = (event: ReactMouseEvent<HTMLButtonElement>) => {
    const press = pressRef.current
    if (!press || press.dragging) return

    const deltaX = Math.abs(event.clientX - press.x)
    const deltaY = Math.abs(event.clientY - press.y)
    if (deltaX >= DRAG_THRESHOLD || deltaY >= DRAG_THRESHOLD) {
      press.dragging = true
      void startWindowDragging()
    }
  }

  const handleClick = () => {
    const press = pressRef.current
    if (press?.dragging) {
      pressRef.current = null
      return
    }

    pressRef.current = null
    setWindowMode('panel')
    void expandToPanel()
  }

  return (
    <section className="ball-shell">
      <button
        type="button"
        className="ball-button"
        aria-label="展开待办面板"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        <span className="ball-button__label">待办</span>
        <strong>{badge}</strong>
      </button>
    </section>
  )
}
