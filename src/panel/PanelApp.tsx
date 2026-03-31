import dayjs from 'dayjs'
import { useEffect, useRef } from 'react'
import type { UnlistenFn } from '@tauri-apps/api/event'

import { collapseToBall, onWindowFocusChanged, startWindowDragging } from '../lib/tauri'
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
  const setWindowMode = useUiStore((state) => state.setWindowMode)
  const blurGuardUntilRef = useRef(0)

  const handleCollapse = () => {
    setWindowMode('ball')
    void collapseToBall()
  }

  const handleStartDrag = () => {
    blurGuardUntilRef.current = Date.now() + 1000
    void startWindowDragging()
  }

  useEffect(() => {
    let disposed = false
    let unlisten: UnlistenFn | undefined

    void onWindowFocusChanged((focused) => {
      if (disposed || focused) return
      if (Date.now() < blurGuardUntilRef.current) return
      setWindowMode('ball')
      void collapseToBall()
    }).then((fn) => {
      unlisten = fn
    })

    return () => {
      disposed = true
      void unlisten?.()
    }
  }, [setWindowMode])

  return (
    <main className="panel-shell">
      <header className="panel-shell__header">
        <div className="panel-shell__dragbar" data-tauri-drag-region onMouseDown={handleStartDrag}>
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
        </div>
        <button type="button" className="panel-shell__close" onClick={handleCollapse}>
          收起
        </button>
      </header>

      <div className="panel-shell__drag-hint" data-tauri-drag-region onMouseDown={handleStartDrag} />

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
