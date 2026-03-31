import dayjs from 'dayjs'
import { useMemo } from 'react'

import { getTimelineGroups, useTodoStore } from '../../store/todo-store'
import { useUiStore } from '../../store/ui-store'

export function TimelineView() {
  const selectedDate = useUiStore((state) => state.selectedDate)
  const todos = useTodoStore((state) => state.todos)
  const toggleTodo = useTodoStore((state) => state.toggleTodo)
  const dateTodos = useMemo(() => todos.filter((todo) => todo.date === selectedDate), [selectedDate, todos])
  const groups = useMemo(() => getTimelineGroups(dateTodos), [dateTodos])

  return (
    <section className="timeline-panel">
      <header className="panel-header">
        <div>
          <p className="eyebrow">时间线</p>
          <h2>{dayjs(selectedDate).format('YYYY 年 M 月 D 日')}</h2>
        </div>
      </header>

      <div className="timeline-section">
        <div className="timeline-section__header">
          <h3>已安排</h3>
          <span>{groups.scheduled.length}</span>
        </div>
        {groups.scheduled.length === 0 ? (
          <p className="empty-text">当前日期还没有带时间的任务。</p>
        ) : (
          <ul className="timeline-list">
            {groups.scheduled.map((todo) => (
              <li key={todo.id} className="timeline-item">
                <label>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                  />
                  <span className={todo.completed ? 'is-completed' : undefined}>{todo.title}</span>
                </label>
                <strong>{todo.time}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="timeline-section">
        <div className="timeline-section__header">
          <h3>未安排</h3>
          <span>{groups.unscheduled.length}</span>
        </div>
        {groups.unscheduled.length === 0 ? (
          <p className="empty-text">当前日期没有未安排时间的任务。</p>
        ) : (
          <ul className="timeline-list">
            {groups.unscheduled.map((todo) => (
              <li key={todo.id} className="timeline-item timeline-item--stacked">
                <label>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                  />
                  <span className={todo.completed ? 'is-completed' : undefined}>{todo.title}</span>
                </label>
                <em>未设置时间</em>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
