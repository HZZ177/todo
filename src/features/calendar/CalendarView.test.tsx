import { fireEvent, render, screen, within } from '@testing-library/react'
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
    panelVisible: true,
    ballPosition: null,
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

describe('CalendarView', () => {
  it('changes month and marks selected date', () => {
    const onMonthChange = vi.fn()
    const { container } = render(<CalendarView month="2026-03-01" onMonthChange={onMonthChange} />)

    fireEvent.click(screen.getByRole('button', { name: '下月' }))
    expect(onMonthChange).toHaveBeenCalledWith('2026-04-01')

    const matchedDay = [...container.querySelectorAll('.calendar-day')].find((node) =>
      within(node as HTMLElement).queryByText('1 项'),
    )
    fireEvent.click(matchedDay as HTMLElement)

    expect(useUiStore.getState().selectedDate).toBe('2026-03-31')
  })
})
