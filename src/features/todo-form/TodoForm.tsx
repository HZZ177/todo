import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'

import { useTodoStore } from '../../store/todo-store'
import { useUiStore } from '../../store/ui-store'

export function TodoForm() {
  const selectedDate = useUiStore((state) => state.selectedDate)
  const addTodo = useTodoStore((state) => state.addTodo)
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')

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
          <p className="eyebrow">快速录入</p>
          <h2>添加待办</h2>
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
        保存待办
      </button>
    </form>
  )
}
