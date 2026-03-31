import type { PropsWithChildren } from 'react'

import { useUiStore } from '../store/ui-store'

export function MorphShell({ children }: PropsWithChildren) {
  const windowMode = useUiStore((state) => state.windowMode)

  return <main className={`morph-shell mode-${windowMode}`}>{children}</main>
}
