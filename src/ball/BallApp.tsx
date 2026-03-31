import { useMemo, useRef } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'

import { startBallDragging, togglePanelWindow } from '../lib/tauri'
import { useTodoStore } from '../store/todo-store'
import { useUiStore } from '../store/ui-store'

const DRAG_THRESHOLD = 6

export function BallApp() {
  const selectedDate = useUiStore((state) => state.selectedDate)
  const todos = useTodoStore((state) => state.todos)
  const pressRef = useRef<{ x: number; y: number; dragging: boolean } | null>(null)

  const badge = useMemo(() => {
    const count = todos.filter((todo) => todo.date === selectedDate && !todo.completed).length
    return count > 0 ? `${count}` : '0'
  }, [selectedDate, todos])

  const handleMouseDown = (event: ReactMouseEvent<HTMLButtonElement>) => {
    console.log('[BallApp] button mouse down')
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
      console.log('[BallApp] drag threshold reached -> start dragging')
      press.dragging = true
      void startBallDragging()
    }
  }

  const handleMouseUp = () => {
    console.log('[BallApp] button mouse up')
  }

  const handleClick = () => {
    const press = pressRef.current
    if (press?.dragging) {
      console.log('[BallApp] click ignored after dragging')
      pressRef.current = null
      return
    }

    console.log('[BallApp] button click -> togglePanelWindow')
    pressRef.current = null
    void togglePanelWindow()
  }

  return (
    <main className="ball-shell">
      <button
        type="button"
        className="ball-button"
        aria-label="展开待办面板"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
      >
        <span className="ball-button__label">待办</span>
        <strong>{badge}</strong>
      </button>
    </main>
  )
}
