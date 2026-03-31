import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { WindowPosition } from '../types/todo'

export type ViewMode = 'day' | 'month' | 'year'

type UiState = {
  selectedDate: string
  visibleMonth: string
  currentView: ViewMode
  panelVisible: boolean
  ballPosition: WindowPosition | null
  setSelectedDate: (date: string) => void
  setVisibleMonth: (month: string) => void
  setCurrentView: (view: ViewMode) => void
  openDayView: (date: string) => void
  setPanelVisible: (visible: boolean) => void
  setBallPosition: (position: WindowPosition) => void
}

const today = new Date().toISOString().slice(0, 10)

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      selectedDate: today,
      visibleMonth: today,
      currentView: 'month',
      panelVisible: false,
      ballPosition: null,
      setSelectedDate: (selectedDate) => set({ selectedDate }),
      setVisibleMonth: (visibleMonth) => set({ visibleMonth }),
      setCurrentView: (currentView) => set({ currentView }),
      openDayView: (selectedDate) => set({ selectedDate, currentView: 'day' }),
      setPanelVisible: (panelVisible) => set({ panelVisible }),
      setBallPosition: (ballPosition) => set({ ballPosition }),
    }),
    {
      name: 'todo-desktop-ui',
      partialize: (state) => ({
        selectedDate: state.selectedDate,
        visibleMonth: state.visibleMonth,
        currentView: state.currentView,
        panelVisible: state.panelVisible,
        ballPosition: state.ballPosition,
      }),
    },
  ),
)
