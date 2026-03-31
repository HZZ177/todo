import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'

import { useTodoStore } from '../../store/todo-store'
import { useUiStore } from '../../store/ui-store'

export function TodoForm() {
  const selectedDate = useUiStore((state) => state.selectedDate)
  const currentView = useUiStore((state) => state.currentView)
  const addTodo = useTodoStore((state) => state.addTodo)
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')

  const heading = currentView === 'month' ? '月视图快速录入' : '当天快速录入'
  const eyebrow = currentView === 'month' ? '快速录入' : '日视图录入'
  const buttonText = currentView === 'month' ? '添加到该日期' : '保存待办'

  const canSubmit = useMemo(() => title.trim().length > 0, [title])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) return

    addTodo({
      title,
      date: selectedDate,
      time,
    })

    setTitle('')
    setTime('')
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="todo-form__header">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{heading}</h2>
        </div>
        <span>{selectedDate}</span>
      </div>

      <label>
        <span>标题</span>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="例如：整理周会材料"
        />
      </label>

      <label>
        <span>时间（可选）</span>
        <input type="time" value={time} onChange={(event) => setTime(event.target.value)} />
      </label>

      <button type="submit" disabled={!canSubmit}>
        {buttonText}
      </button>
    </form>
  )
}
