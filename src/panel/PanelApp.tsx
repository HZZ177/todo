import { useState } from 'react'
import dayjs from 'dayjs'

import { CalendarView } from '../features/calendar/CalendarView'
import { TimelineView } from '../features/timeline/TimelineView'
import { TodoForm } from '../features/todo-form/TodoForm'
import { hidePanelWindow } from '../lib/tauri'
import { useUiStore } from '../store/ui-store'

export function PanelApp() {
  const selectedDate = useUiStore((state) => state.selectedDate)
  const [visibleMonth, setVisibleMonth] = useState(selectedDate)

  return (
    <main className="panel-shell">
      <header className="panel-shell__header">
        <div>
          <p className="eyebrow">Windows Desktop Todo</p>
          <h1>{dayjs(selectedDate).format('M 月 D 日')} 的安排</h1>
        </div>
        <button type="button" className="panel-shell__close" onClick={() => void hidePanelWindow()}>
          收起
        </button>
      </header>

      <section className="panel-shell__body">
        <CalendarView month={visibleMonth} onMonthChange={setVisibleMonth} />
        <div className="panel-shell__content">
          <TodoForm />
          <TimelineView />
        </div>
      </section>
    </main>
  )
}
