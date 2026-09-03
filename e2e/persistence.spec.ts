import { test, expect } from '@playwright/test'

test('task persists after page reload', async ({ page }) => {
  const taskText = 'Playwright persistent task'

  await page.goto('/')
  await page.evaluate(() => window.localStorage.clear())
  await page.reload()

  await page.getByTestId('task-input').fill(taskText)
  await page.getByTestId('task-add-button').click()
  await expect(page.getByText(taskText)).toBeVisible()

  await page.reload()
  await expect(page.getByText(taskText)).toBeVisible()
})

test('archiving a completed task removes it from the active list and persists across reload', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => {
    window.localStorage.setItem('tasks', JSON.stringify([
      { id: 1, text: 'Archive me', completed: true, archived: false },
    ]))
  })
  await page.reload()

  // Archive button is only visible on the completed task.
  await page.getByTestId('task-archive-button-1').click()
  await expect(page.getByText('Archive me')).not.toBeVisible()

  // Persists across reload.
  await page.reload()
  await expect(page.getByText('Archive me')).not.toBeVisible()
})

test('archive toggle reveals and hides the archived section', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => {
    window.localStorage.setItem('tasks', JSON.stringify([
      { id: 1, text: 'Archived task', completed: true, archived: true },
    ]))
  })
  await page.reload()

  // Toggle on: archived section shows the archived task.
  await page.getByTestId('archive-toggle-button').click()
  await expect(page.getByTestId('archived-list')).toBeVisible()
  await expect(page.getByTestId('archived-list')).toContainText('Archived task')

  // Toggle off: archived section is hidden.
  await page.getByTestId('archive-toggle-button').click()
  await expect(page.getByTestId('archived-list')).not.toBeVisible()
})

test('archive toggle shows an empty state when there are no archived tasks', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => {
    window.localStorage.setItem('tasks', JSON.stringify([
      { id: 1, text: 'Open task', completed: false, archived: false },
    ]))
  })
  await page.reload()

  await page.getByTestId('archive-toggle-button').click()

  await expect(page.getByTestId('archived-empty')).toBeVisible()
})
