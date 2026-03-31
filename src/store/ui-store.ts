import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { WindowPosition } from '../types/todo'

type UiState = {
  selectedDate: string
  panelVisible: boolean
  ballPosition: WindowPosition | null
  setSelectedDate: (date: string) => void
  setPanelVisible: (visible: boolean) => void
  setBallPosition: (position: WindowPosition) => void
}

const today = new Date().toISOString().slice(0, 10)

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      selectedDate: today,
      panelVisible: false,
      ballPosition: null,
      setSelectedDate: (selectedDate) => set({ selectedDate }),
      setPanelVisible: (panelVisible) => set({ panelVisible }),
      setBallPosition: (ballPosition) => set({ ballPosition }),
    }),
    {
      name: 'todo-desktop-ui',
      partialize: (state) => ({
        selectedDate: state.selectedDate,
        panelVisible: state.panelVisible,
        ballPosition: state.ballPosition,
      }),
    },
  ),
)
