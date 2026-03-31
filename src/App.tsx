import { BallApp } from './ball/BallApp'
import { PanelApp } from './panel/PanelApp'
import { useUiStore } from './store/ui-store'

function App() {
  const windowMode = useUiStore((state) => state.windowMode)

  return (
    <main className={`morph-shell mode-${windowMode}`}>
      {windowMode === 'ball' ? <BallApp /> : <PanelApp />}
    </main>
  )
}

export default App
