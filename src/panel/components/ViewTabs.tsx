import type { ViewMode } from '../../store/ui-store'

type ViewTabsProps = {
  currentView: ViewMode
  onChange: (view: ViewMode) => void
}

const labels: Array<{ key: ViewMode; label: string }> = [
  { key: 'day', label: '日视图' },
  { key: 'month', label: '月视图' },
  { key: 'year', label: '年视图' },
]

export function ViewTabs({ currentView, onChange }: ViewTabsProps) {
  return (
    <div className="view-tabs" role="tablist" aria-label="视图切换">
      {labels.map((item) => (
        <button
          key={item.key}
          type="button"
          className={`view-tabs__item${item.key === currentView ? ' is-active' : ''}`}
          onClick={() => onChange(item.key)}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
