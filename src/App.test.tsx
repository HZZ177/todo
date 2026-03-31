import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

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
    panelVisible: true,
    ballPosition: null,
  })
  useTodoStore.setState({ todos: [] })
})

describe('App', () => {
  it('opens day view after selecting a date', () => {
    render(<App />)
    fireEvent.click(screen.getByText('31'))
    expect(screen.getByText('当日待办')).toBeInTheDocument()
  })
})
