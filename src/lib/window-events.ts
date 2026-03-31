import { emit } from '@tauri-apps/api/event'

export const TODO_DATA_CHANGED_EVENT = 'todo-data-changed'

export async function emitTodoDataChanged() {
  try {
    await emit(TODO_DATA_CHANGED_EVENT)
  } catch {
    // 非 Tauri 环境忽略
  }
}
