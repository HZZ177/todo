import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

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
    panelVisible: true,
    ballPosition: null,
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
