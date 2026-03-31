import { invoke } from '@tauri-apps/api/core'
import { getCurrentWindow } from '@tauri-apps/api/window'
import type { UnlistenFn } from '@tauri-apps/api/event'

export async function expandToPanel() {
  try {
    await invoke('expand_to_panel')
  } catch (error) {
    console.error('[tauri] expand_to_panel failed', error)
  }
}

export async function collapseToBall() {
  try {
    await invoke('collapse_to_ball')
  } catch (error) {
    console.error('[tauri] collapse_to_ball failed', error)
  }
}

export async function syncWindowPosition(x: number, y: number) {
  try {
    await invoke('sync_window_position', { x, y })
  } catch (error) {
    console.error('[tauri] sync_window_position failed', error)
  }
}

export async function startWindowDragging() {
  try {
    await getCurrentWindow().startDragging()
  } catch (error) {
    console.error('[tauri] startWindowDragging failed', error)
  }
}

export async function hidePanelWindow() {
  return collapseToBall()
}

export async function onWindowFocusChanged(handler: (focused: boolean) => void): Promise<UnlistenFn | undefined> {
  try {
    const window = getCurrentWindow()
    return await window.onFocusChanged(({ payload }) => {
      handler(payload)
    })
  } catch (error) {
    console.error('[tauri] onWindowFocusChanged failed', error)
    return undefined
  }
}
