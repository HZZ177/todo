import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import App from '../../App'
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
  useTodoStore.setState({ todos: [] })
})

describe('TodoForm integration', () => {
  it('creates unscheduled todo and syncs panel views', () => {
    render(<App />)

    fireEvent.change(screen.getByPlaceholderText('例如：整理周会材料'), {
      target: { value: '准备周报' },
    })
    fireEvent.click(screen.getByRole('button', { name: '保存待办' }))

    expect(screen.getByText('准备周报')).toBeInTheDocument()
    expect(screen.getByText('未设置时间')).toBeInTheDocument()
    expect(screen.getByText('1 项')).toBeInTheDocument()
  })

  it('creates scheduled todo and toggles completion', () => {
    render(<App />)

    fireEvent.change(screen.getByPlaceholderText('例如：整理周会材料'), {
      target: { value: '方案评审' },
    })
    fireEvent.change(screen.getByLabelText('时间（可选）'), {
      target: { value: '14:00' },
    })
    fireEvent.click(screen.getByRole('button', { name: '保存待办' }))

    expect(screen.getByText('14:00')).toBeInTheDocument()
    const checkbox = screen.getAllByRole('checkbox')[0]
    fireEvent.click(checkbox)

    expect(screen.getByText('方案评审')).toHaveClass('is-completed')
  })
})
