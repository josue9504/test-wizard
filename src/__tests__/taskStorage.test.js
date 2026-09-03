import { describe, it, expect, beforeEach, vi } from 'vitest'
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
    const tasks = [{ id: 1, text: 'Saved task', completed: false, archived: false }]
    window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))

    expect(loadTasksFromStorage()).toEqual(tasks)
  })

  it('returns an empty array when storage has invalid json', () => {
    window.localStorage.setItem(TASKS_STORAGE_KEY, 'not-json')

    expect(loadTasksFromStorage()).toEqual([])
  })

  it('returns an empty array when storage has a non-array value', () => {
    window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify({ id: 1 }))

    expect(loadTasksFromStorage()).toEqual([])
  })

  it('normalizes missing archived flag to false', () => {
    const tasks = [{ id: 1, text: 'Legacy task', completed: false }]
    window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))

    const loaded = loadTasksFromStorage()

    expect(loaded[0].archived).toBe(false)
  })

  it('preserves existing archived flag when present', () => {
    const tasks = [{ id: 1, text: 'Archived task', completed: true, archived: true }]
    window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))

    const loaded = loadTasksFromStorage()

    expect(loaded[0].archived).toBe(true)
  })

  it('saves tasks in localStorage as json', () => {
    const tasks = [{ id: 1, text: 'New task', completed: true }]

    saveTasksToStorage(tasks)

    expect(window.localStorage.getItem(TASKS_STORAGE_KEY)).toBe(JSON.stringify(tasks))
  })

  it('returns true on successful save', () => {
    const tasks = [{ id: 1, text: 'New task', completed: true }]

    expect(saveTasksToStorage(tasks)).toBe(true)
  })

  it('returns false and does not throw when localStorage quota is exceeded', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
    setItemSpy.mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })

    const tasks = [{ id: 1, text: 'New task', completed: true }]

    const result = saveTasksToStorage(tasks)

    expect(result).toBe(false)

    setItemSpy.mockRestore()
  })
})
