export const TASKS_STORAGE_KEY = 'tasks'

// Normalize a single task so every persisted task carries the full shape.
function normalizeTask(task) {
  return {
    id: task.id,
    text: task.text,
    completed: Boolean(task.completed),
    archived: task.archived === true,
  }
}

// Load and normalize the task array from localStorage.
// Returns [] on missing key, invalid JSON, or a non-array value.
export function loadTasksFromStorage() {
  try {
    const raw = window.localStorage.getItem(TASKS_STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.map(normalizeTask)
  } catch {
    return []
  }
}

// Persist the task array to localStorage.
// Returns false (without throwing) when the quota is exceeded; true on success.
export function saveTasksToStorage(tasks) {
  try {
    window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
    return true
  } catch {
    return false
  }
}
