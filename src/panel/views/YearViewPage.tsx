import dayjs from 'dayjs'

type YearViewPageProps = {
  visibleMonth: string
  onSelectMonth: (month: string) => void
}

export function YearViewPage({ visibleMonth, onSelectMonth }: YearViewPageProps) {
  const year = dayjs(visibleMonth).year()
  const months = Array.from({ length: 12 }, (_, index) => dayjs(`${year}-01-01`).month(index))

  return (
    <section className="panel-page panel-page--year">
      <header className="year-page__header">
        <p className="eyebrow">年视图</p>
        <h2>{year} 年</h2>
      </header>
      <div className="year-grid">
        {months.map((month) => (
          <button
            key={month.format('YYYY-MM')}
            type="button"
            className="year-grid__item"
            onClick={() => onSelectMonth(month.format('YYYY-MM-DD'))}
          >
            {month.format('M 月')}
          </button>
        ))}
      </div>
    </section>
  )
}
