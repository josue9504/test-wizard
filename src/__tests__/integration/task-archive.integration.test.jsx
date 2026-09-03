import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskManager from '../../TaskManager'
import { TASKS_STORAGE_KEY } from '../../taskStorage'

// Helper to seed localStorage with persisted tasks.
function seedTasks(tasks) {
  window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
}

describe('TaskManager archive', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders an archive button only on completed tasks', () => {
    seedTasks([
      { id: 1, text: 'Done task', completed: true, archived: false },
      { id: 2, text: 'Open task', completed: false, archived: false },
    ])

    render(<TaskManager />)

    expect(screen.getByTestId('task-archive-button-1')).toBeInTheDocument()
    expect(screen.queryByTestId('task-archive-button-2')).not.toBeInTheDocument()
  })

  it('archives a completed task and removes it from the active list', async () => {
    const user = userEvent.setup()
    seedTasks([{ id: 1, text: 'Done task', completed: true, archived: false }])

    render(<TaskManager />)

    await user.click(screen.getByTestId('task-archive-button-1'))

    expect(screen.queryByText('Done task')).not.toBeInTheDocument()
    const tasks = JSON.parse(window.localStorage.getItem(TASKS_STORAGE_KEY))
    expect(tasks[0].archived).toBe(true)
  })

  it('toggles the archived section on and off', async () => {
    const user = userEvent.setup()
    seedTasks([{ id: 1, text: 'Archived task', completed: true, archived: true }])

    render(<TaskManager />)

    const toggle = screen.getByTestId('archive-toggle-button')
    expect(screen.queryByTestId('archived-list')).not.toBeInTheDocument()

    await user.click(toggle)
    const archivedList = screen.getByTestId('archived-list')
    expect(within(archivedList).getByText('Archived task')).toBeInTheDocument()

    await user.click(toggle)
    expect(screen.queryByTestId('archived-list')).not.toBeInTheDocument()
  })

  it('shows an empty state in the archived section when there are no archived tasks', async () => {
    const user = userEvent.setup()
    seedTasks([{ id: 1, text: 'Open task', completed: false, archived: false }])

    render(<TaskManager />)

    await user.click(screen.getByTestId('archive-toggle-button'))

    expect(screen.getByTestId('archived-empty')).toBeInTheDocument()
  })

  it('keeps an archived flag across unmount and remount', async () => {
    const user = userEvent.setup()
    seedTasks([{ id: 1, text: 'Done task', completed: true, archived: false }])

    const { unmount } = render(<TaskManager />)

    await user.click(screen.getByTestId('task-archive-button-1'))
    unmount()

    render(<TaskManager />)
    await user.click(screen.getByTestId('archive-toggle-button'))

    expect(within(screen.getByTestId('archived-list')).getByText('Done task')).toBeInTheDocument()
  })
})
