import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../lib/tauri', () => ({
  expandToPanel: vi.fn(),
  startWindowDragging: vi.fn(),
}))

import { BallApp } from './BallApp'
import { useTodoStore } from '../store/todo-store'
import { useUiStore } from '../store/ui-store'

describe('BallApp', () => {
  beforeEach(() => {
    window.localStorage.clear()
    useTodoStore.persist.clearStorage()
    useUiStore.persist.clearStorage()
    useUiStore.setState({
      selectedDate: '2026-03-31',
      visibleMonth: '2026-03-01',
      currentView: 'month',
      windowMode: 'ball',
      windowPosition: null,
    })
    useTodoStore.setState({
      todos: [
        {
          id: '1',
          title: '准备周会',
          date: '2026-03-31',
          completed: false,
          createdAt: '2026-03-01T00:00:00.000Z',
          updatedAt: '2026-03-01T00:00:00.000Z',
        },
      ],
    })
  })

  it('shows todo badge and switches to panel mode', () => {
    render(<BallApp />)
    expect(screen.getByText('1')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '展开待办面板' }))
    expect(useUiStore.getState().windowMode).toBe('panel')
  })
})
