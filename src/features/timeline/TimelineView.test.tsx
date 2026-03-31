import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { TimelineView } from './TimelineView'
import { useTodoStore } from '../../store/todo-store'
import { useUiStore } from '../../store/ui-store'

beforeEach(() => {
  window.localStorage.clear()
  useTodoStore.persist.clearStorage()
  useUiStore.persist.clearStorage()
  useUiStore.setState({
    selectedDate: '2026-03-31',
    visibleMonth: '2026-03-01',
    currentView: 'day',
    windowMode: 'panel',
    windowPosition: null,
  })
  useTodoStore.setState({
    todos: [
      {
        id: '1',
        title: '晨会',
        date: '2026-03-31',
        time: '09:30',
        completed: false,
        createdAt: '2026-03-01T00:00:00.000Z',
        updatedAt: '2026-03-01T00:00:00.000Z',
      },
      {
        id: '2',
        title: '写日报',
        date: '2026-03-31',
        completed: false,
        createdAt: '2026-03-01T01:00:00.000Z',
        updatedAt: '2026-03-01T01:00:00.000Z',
      },
      {
        id: '3',
        title: '方案评审',
        date: '2026-03-31',
        time: '14:00',
        completed: false,
        createdAt: '2026-03-01T02:00:00.000Z',
        updatedAt: '2026-03-01T02:00:00.000Z',
      },
    ],
  })
})

describe('TimelineView', () => {
  it('groups scheduled and unscheduled todos in sorted order', () => {
    render(<TimelineView />)

    const texts = screen.getAllByText(/晨会|方案评审|写日报/).map((node) => node.textContent)
    expect(texts).toEqual(['晨会', '方案评审', '写日报'])
    expect(screen.getByText('未设置时间')).toBeInTheDocument()
    expect(screen.getByText('09:30')).toBeInTheDocument()
    expect(screen.getByText('14:00')).toBeInTheDocument()
  })
})
