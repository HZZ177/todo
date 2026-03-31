import { beforeEach, describe, expect, it } from 'vitest'

import { getMonthSummary, getTimelineGroups, useTodoStore } from './todo-store'

beforeEach(() => {
  window.localStorage.clear()
  useTodoStore.persist.clearStorage()
  useTodoStore.setState({ todos: [] })
})

describe('todo-store', () => {
  it('persists todos to localStorage', () => {
    useTodoStore.getState().addTodo({
      title: '整理文档',
      date: '2026-03-31',
      time: '09:30',
    })

    const raw = window.localStorage.getItem('todo-desktop-todos')
    expect(raw).toContain('整理文档')
  })

  it('builds month summary and timeline groups', () => {
    const todos = [
      {
        id: '1',
        title: 'A',
        date: '2026-03-31',
        time: '09:30',
        completed: false,
        createdAt: '2026-03-01T00:00:00.000Z',
        updatedAt: '2026-03-01T00:00:00.000Z',
      },
      {
        id: '2',
        title: 'B',
        date: '2026-03-31',
        completed: false,
        createdAt: '2026-03-01T01:00:00.000Z',
        updatedAt: '2026-03-01T01:00:00.000Z',
      },
    ]

    expect(getMonthSummary(todos, '2026-03-01')).toEqual({ '2026-03-31': 2 })
    const groups = getTimelineGroups(todos)
    expect(groups.scheduled).toHaveLength(1)
    expect(groups.unscheduled).toHaveLength(1)
  })
})
