import { test, expect } from '@playwright/test'

test('task persists after page reload', async ({ page }) => {
  const taskText = 'Playwright persistent task'

  await page.goto('/')
  await page.evaluate(() => window.localStorage.clear())

  await page.getByPlaceholder('Add a new task').fill(taskText)
  await page.getByRole('button', { name: 'Add' }).click()
  await expect(page.getByText(taskText)).toBeVisible()

  await page.reload()
  await expect(page.getByText(taskText)).toBeVisible()
})
