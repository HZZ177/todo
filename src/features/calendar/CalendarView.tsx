import dayjs from 'dayjs'
import clsx from 'clsx'

import { useTodoStore, getMonthSummary } from '../../store/todo-store'
import { useUiStore } from '../../store/ui-store'

type CalendarViewProps = {
  month: string
  onMonthChange: (nextMonth: string) => void
}

export function CalendarView({ month, onMonthChange }: CalendarViewProps) {
  const selectedDate = useUiStore((state) => state.selectedDate)
  const setSelectedDate = useUiStore((state) => state.setSelectedDate)
  const todos = useTodoStore((state) => state.todos)

  const monthDate = dayjs(month)
  const monthStart = monthDate.startOf('month')
  const gridStart = monthStart.startOf('week')
  const monthSummary = getMonthSummary(todos, month)

  const days = Array.from({ length: 42 }, (_, index) => gridStart.add(index, 'day'))

  return (
    <section className="calendar-panel">
      <header className="panel-header">
        <div>
          <p className="eyebrow">月视图</p>
          <h2>{monthDate.format('YYYY 年 M 月')}</h2>
        </div>
        <div className="calendar-actions">
          <button type="button" onClick={() => onMonthChange(monthDate.subtract(1, 'month').format('YYYY-MM-DD'))}>
            上月
          </button>
          <button type="button" onClick={() => onMonthChange(dayjs().format('YYYY-MM-DD'))}>
            本月
          </button>
          <button type="button" onClick={() => onMonthChange(monthDate.add(1, 'month').format('YYYY-MM-DD'))}>
            下月
          </button>
        </div>
      </header>

      <div className="calendar-weekdays">
        {['一', '二', '三', '四', '五', '六', '日'].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((day) => {
          const isoDate = day.format('YYYY-MM-DD')
          const count = monthSummary[isoDate] ?? 0
          return (
            <button
              key={isoDate}
              type="button"
              className={clsx('calendar-day', {
                'is-outside': !day.isSame(monthDate, 'month'),
                'is-selected': isoDate === selectedDate,
                'is-today': isoDate === dayjs().format('YYYY-MM-DD'),
              })}
              onClick={() => setSelectedDate(isoDate)}
            >
              <span className="calendar-day__date">{day.date()}</span>
              <span className="calendar-day__count">{count > 0 ? `${count} 项` : ''}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
