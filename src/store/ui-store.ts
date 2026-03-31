import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { WindowPosition } from '../types/todo'

export type ViewMode = 'day' | 'month' | 'year'
export type WindowMode = 'ball' | 'panel'

type UiState = {
  selectedDate: string
  visibleMonth: string
  currentView: ViewMode
  windowMode: WindowMode
  windowPosition: WindowPosition | null
  setSelectedDate: (date: string) => void
  setVisibleMonth: (month: string) => void
  setCurrentView: (view: ViewMode) => void
  setWindowMode: (mode: WindowMode) => void
  openDayView: (date: string) => void
  setWindowPosition: (position: WindowPosition) => void
}

const today = new Date().toISOString().slice(0, 10)

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      selectedDate: today,
      visibleMonth: today,
      currentView: 'month',
      windowMode: 'ball',
      windowPosition: null,
      setSelectedDate: (selectedDate) => set({ selectedDate }),
      setVisibleMonth: (visibleMonth) => set({ visibleMonth }),
      setCurrentView: (currentView) => set({ currentView }),
      setWindowMode: (windowMode) => set({ windowMode }),
      openDayView: (selectedDate) => set({ selectedDate, currentView: 'day', windowMode: 'panel' }),
      setWindowPosition: (windowPosition) => set({ windowPosition }),
    }),
    {
      name: 'todo-desktop-ui',
      partialize: (state) => ({
        selectedDate: state.selectedDate,
        visibleMonth: state.visibleMonth,
        currentView: state.currentView,
        windowMode: state.windowMode,
        windowPosition: state.windowPosition,
      }),
    },
  ),
)
