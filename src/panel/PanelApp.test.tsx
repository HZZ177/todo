import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../lib/tauri', () => ({
  collapseToBall: vi.fn(),
  onWindowFocusChanged: vi.fn(async () => undefined),
  startWindowDragging: vi.fn(),
}))

import { PanelApp } from './PanelApp'
import { useTodoStore } from '../store/todo-store'
import { useUiStore } from '../store/ui-store'

beforeEach(() => {
  window.localStorage.clear()
  useTodoStore.persist.clearStorage()
  useUiStore.persist.clearStorage()
  useUiStore.setState({
    selectedDate: '2026-03-31',
    visibleMonth: '2026-03-01',
    currentView: 'month',
    windowMode: 'panel',
    windowPosition: null,
  })
  useTodoStore.setState({ todos: [] })
})

describe('PanelApp', () => {
  it('switches between month and year views', () => {
    render(<PanelApp />)
    fireEvent.click(screen.getByRole('button', { name: '年视图' }))
    expect(screen.getByRole('heading', { name: '2026 年' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '3 月' }))
    expect(useUiStore.getState().currentView).toBe('month')
  })
})
