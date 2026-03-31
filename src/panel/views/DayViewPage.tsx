import dayjs from 'dayjs'

import { TimelineView } from '../../features/timeline/TimelineView'

type DayViewPageProps = {
  selectedDate: string
  onBack: () => void
}

export function DayViewPage({ selectedDate, onBack }: DayViewPageProps) {
  return (
    <section className="panel-page panel-page--day">
      <header className="day-page__header">
        <button type="button" className="day-page__back" onClick={onBack}>
          返回月视图
        </button>
        <div>
          <p className="eyebrow">当日待办</p>
          <h2>{dayjs(selectedDate).format('YYYY 年 M 月 D 日')}</h2>
        </div>
      </header>
      <TimelineView />
    </section>
  )
}
