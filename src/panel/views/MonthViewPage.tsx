import { CalendarView } from '../../features/calendar/CalendarView'
import { TodoForm } from '../../features/todo-form/TodoForm'

type MonthViewPageProps = {
  visibleMonth: string
  onMonthChange: (month: string) => void
}

export function MonthViewPage({ visibleMonth, onMonthChange }: MonthViewPageProps) {
  return (
    <section className="panel-page panel-page--month">
      <CalendarView month={visibleMonth} onMonthChange={onMonthChange} />
      <TodoForm />
    </section>
  )
}
