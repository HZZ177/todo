import dayjs from 'dayjs'

import { hidePanelWindow } from '../lib/tauri'
import { useUiStore } from '../store/ui-store'
import { ViewTabs } from './components/ViewTabs'
import { DayViewPage } from './views/DayViewPage'
import { MonthViewPage } from './views/MonthViewPage'
import { YearViewPage } from './views/YearViewPage'

export function PanelApp() {
  const selectedDate = useUiStore((state) => state.selectedDate)
  const visibleMonth = useUiStore((state) => state.visibleMonth)
  const currentView = useUiStore((state) => state.currentView)
  const setCurrentView = useUiStore((state) => state.setCurrentView)
  const setVisibleMonth = useUiStore((state) => state.setVisibleMonth)

  return (
    <main className="panel-shell">
      <header className="panel-shell__header">
        <div>
          <p className="eyebrow">Windows Desktop Todo</p>
          <h1>
            {currentView === 'year'
              ? `${dayjs(visibleMonth).format('YYYY 年')}总览`
              : currentView === 'month'
                ? `${dayjs(visibleMonth).format('YYYY 年 M 月')}安排`
                : `${dayjs(selectedDate).format('M 月 D 日')}待办详情`}
          </h1>
        </div>
        <button type="button" className="panel-shell__close" onClick={() => void hidePanelWindow()}>
          收起
        </button>
      </header>

      <ViewTabs currentView={currentView} onChange={setCurrentView} />

      <section className="panel-shell__body">
        {currentView === 'month' ? <MonthViewPage visibleMonth={visibleMonth} onMonthChange={setVisibleMonth} /> : null}
        {currentView === 'day' ? <DayViewPage selectedDate={selectedDate} onBack={() => setCurrentView('month')} /> : null}
        {currentView === 'year' ? (
          <YearViewPage
            visibleMonth={visibleMonth}
            onSelectMonth={(month) => {
              setVisibleMonth(month)
              setCurrentView('month')
            }}
          />
        ) : null}
      </section>
    </main>
  )
}
