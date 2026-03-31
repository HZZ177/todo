import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CalendarView } from './CalendarView'
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
    panelVisible: true,
    ballPosition: null,
  })
  useTodoStore.setState({ todos: [] })
})

describe('CalendarView', () => {
  it('changes month and opens day view after selecting date', () => {
    const onMonthChange = vi.fn()
    render(<CalendarView month="2026-03-01" onMonthChange={onMonthChange} />)

    fireEvent.click(screen.getByRole('button', { name: '下月' }))
    expect(onMonthChange).toHaveBeenCalledWith('2026-04-01')

    fireEvent.click(screen.getByText('31'))
    expect(useUiStore.getState().currentView).toBe('day')
    expect(useUiStore.getState().selectedDate).toBe('2026-03-31')
  })
})
