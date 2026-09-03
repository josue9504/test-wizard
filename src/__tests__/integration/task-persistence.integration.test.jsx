import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskManager from '../../TaskManager'

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
})
