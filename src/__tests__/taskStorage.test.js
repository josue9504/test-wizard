import { describe, it, expect, beforeEach } from 'vitest'
import {
  TASKS_STORAGE_KEY,
  loadTasksFromStorage,
  saveTasksToStorage,
} from '../taskStorage'

describe('taskStorage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('returns an empty array when no tasks are saved', () => {
    expect(loadTasksFromStorage()).toEqual([])
  })

  it('returns parsed tasks when storage has valid json', () => {
    const tasks = [{ id: 1, text: 'Saved task', completed: false }]
    window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))

    expect(loadTasksFromStorage()).toEqual(tasks)
  })

  it('returns an empty array when storage has invalid json', () => {
    window.localStorage.setItem(TASKS_STORAGE_KEY, 'not-json')

    expect(loadTasksFromStorage()).toEqual([])
  })

  it('saves tasks in localStorage as json', () => {
    const tasks = [{ id: 1, text: 'New task', completed: true }]

    saveTasksToStorage(tasks)

    expect(window.localStorage.getItem(TASKS_STORAGE_KEY)).toBe(JSON.stringify(tasks))
  })
})
