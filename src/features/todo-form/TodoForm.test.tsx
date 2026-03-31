import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../lib/tauri', () => ({
  expandToPanel: vi.fn(),
  collapseToBall: vi.fn(),
  startWindowDragging: vi.fn(),
  syncWindowPosition: vi.fn(),
  hidePanelWindow: vi.fn(),
  onWindowFocusChanged: vi.fn(async () => undefined),
}))

import App from '../../App'
import { useTodoStore } from '../../store/todo-store'
import { useUiStore } from '../../store/ui-store'

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

describe('TodoForm integration', () => {
  it('creates unscheduled todo in month view and shows date count', () => {
    render(<App />)

    fireEvent.change(screen.getByPlaceholderText('例如：整理周会材料'), {
      target: { value: '准备周报' },
    })
    fireEvent.click(screen.getByRole('button', { name: '添加到该日期' }))

    expect(screen.getByText('1 项')).toBeInTheDocument()
  })

  it('creates scheduled todo and shows it in day view after date selection', () => {
    render(<App />)

    fireEvent.change(screen.getByPlaceholderText('例如：整理周会材料'), {
      target: { value: '方案评审' },
    })
    fireEvent.change(screen.getByLabelText('时间（可选）'), {
      target: { value: '14:00' },
    })
    fireEvent.click(screen.getByRole('button', { name: '添加到该日期' }))
    fireEvent.click(screen.getByText('31'))

    expect(screen.getByText('14:00')).toBeInTheDocument()
  })
})
