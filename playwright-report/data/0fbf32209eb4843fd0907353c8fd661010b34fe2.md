# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: persistence.spec.ts >> task persists after page reload
- Location: e2e/persistence.spec.ts:3:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Playwright persistent task')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Playwright persistent task')

```

```yaml
- heading "Task Manager" [level=1]
- textbox "Add a new task"
- button "Add"
- list
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test('task persists after page reload', async ({ page }) => {
  4  |   const taskText = 'Playwright persistent task'
  5  | 
  6  |   await page.goto('/')
  7  |   await page.evaluate(() => window.localStorage.clear())
  8  | 
  9  |   await page.getByPlaceholder('Add a new task').fill(taskText)
  10 |   await page.getByRole('button', { name: 'Add' }).click()
  11 |   await expect(page.getByText(taskText)).toBeVisible()
  12 | 
  13 |   await page.reload()
> 14 |   await expect(page.getByText(taskText)).toBeVisible()
     |                                          ^ Error: expect(locator).toBeVisible() failed
  15 | })
  16 | 
```