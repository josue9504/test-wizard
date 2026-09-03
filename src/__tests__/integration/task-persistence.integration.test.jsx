import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskManager from '../../TaskManager'
import { TASKS_STORAGE_KEY } from '../../taskStorage'

describe('TaskManager persistence', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('restores tasks from localStorage on reload', async () => {
    const user = userEvent.setup()
    const taskText = 'Persistent task'

    const { unmount } = render(<TaskManager />)

    await user.type(screen.getByPlaceholderText('Add a new task'), taskText)
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(screen.getByText(taskText)).toBeInTheDocument()

    unmount()
    render(<TaskManager />)

    expect(screen.getByText(taskText)).toBeInTheDocument()
  })

  it('persists tasks to localStorage after adding', async () => {
    const user = userEvent.setup()

    render(<TaskManager />)

    await user.type(screen.getByPlaceholderText('Add a new task'), 'Save me')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    const tasks = JSON.parse(window.localStorage.getItem(TASKS_STORAGE_KEY))
    expect(tasks).toHaveLength(1)
    expect(tasks[0]).toMatchObject({ text: 'Save me', completed: false, archived: false })
  })

  it('persists a completed flag to localStorage after toggling', async () => {
    const user = userEvent.setup()

    render(<TaskManager />)

    await user.type(screen.getByPlaceholderText('Add a new task'), 'Toggle me')
    await user.click(screen.getByRole('button', { name: 'Add' }))
    await user.click(screen.getByRole('checkbox'))

    const tasks = JSON.parse(window.localStorage.getItem(TASKS_STORAGE_KEY))
    expect(tasks[0].completed).toBe(true)
  })

  it('handles corrupt localStorage data without crashing', () => {
    window.localStorage.setItem(TASKS_STORAGE_KEY, 'not-json')

    render(<TaskManager />)

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
  })

  it('initializes an empty list when localStorage has no tasks key', () => {
    render(<TaskManager />)

    expect(screen.getByPlaceholderText('Add a new task')).toBeInTheDocument()
  })
})
