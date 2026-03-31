import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./lib/tauri', () => ({
  expandToPanel: vi.fn(),
  collapseToBall: vi.fn(),
  startWindowDragging: vi.fn(),
  syncWindowPosition: vi.fn(),
  hidePanelWindow: vi.fn(),
  onWindowFocusChanged: vi.fn(async () => undefined),
}))

import App from './App'
import { useTodoStore } from './store/todo-store'
import { useUiStore } from './store/ui-store'

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
  useTodoStore.setState({ todos: [] })
})

describe('App', () => {
  it('switches from ball to panel', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: '展开待办面板' }))
    expect(useUiStore.getState().windowMode).toBe('panel')
  })
})
