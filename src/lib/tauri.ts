import { invoke } from '@tauri-apps/api/core'

export async function togglePanelWindow() {
  try {
    await invoke('toggle_panel_window')
  } catch {
    // 浏览器模式下忽略
  }
}

export async function hidePanelWindow() {
  try {
    await invoke('hide_panel_window')
  } catch {
    // 浏览器模式下忽略
  }
}

export async function showPanelWindow() {
  try {
    await invoke('show_panel_window')
  } catch {
    // 浏览器模式下忽略
  }
}

export async function syncBallPosition(x: number, y: number) {
  try {
    await invoke('sync_ball_position', { x, y })
  } catch {
    // 浏览器模式下忽略
  }
}
