# Tasks: Task Persistence and Archive

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 280–320 |
| 400-line budget risk | Medium |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | taskStorage.js + unit tests (TDD RED→GREEN) | PR 1 | `npx vitest run src/__tests__/taskStorage.test.js` | N/A — pure helpers, no runtime UI boundary | Revert `src/taskStorage.js` + test file |
| 2 | TaskManager persistence + archive (TDD RED→GREEN) | PR 1 | `npx vitest run src/__tests__/integration/` | `npm run dev` + add/toggle/archive/reload manually | Revert `src/TaskManager.jsx` + `src/TaskManager.css` |
| 3 | E2E persistence + archive spec | PR 1 | `npx playwright test e2e/persistence.spec.ts` | `npm run dev` + Playwright reload flow | Revert e2e spec file only |

## Phase 1: Foundation (TDD RED → GREEN)

- [x] 1.1 Create `src/taskStorage.js` exporting `TASKS_STORAGE_KEY='tasks'`, `loadTasksFromStorage` (try/catch parse, non-array → `[]`, normalize missing `archived` → `false`), `saveTasksToStorage` (quota-exceeded → return `false` silently, else write + return `true`). Created BEFORE any TaskManager.jsx edits (existing suite imports it).
- [x] 1.2 Extend `src/__tests__/taskStorage.test.js`: RED for load-missing-key→`[]`, corrupt-JSON→`[]`, non-array→`[]`; GREEN via 1.1. Add cases: absent `archived` normalizes to `false`.

## Phase 2: Core Implementation (TDD RED → GREEN)

- [x] 2.1 `src/TaskManager.jsx`: RED integration test `src/__tests__/integration/task-archive.integration.test.jsx` (archive completed task, archive button only on completed, toggle shows/hides archived, empty archived state). GREEN: add `archiveTask` handler, `showArchived` state, derived `active`/`archived` filters (`tasks.filter(t => !t.archived)`).
- [x] 2.2 `src/TaskManager.jsx`: RED for load-on-mount (extend `src/__tests__/integration/task-persistence.integration.test.jsx` with corrupt-storage case). GREEN: add `useEffect` calling `setTasks(loadTasksFromStorage())` on mount.
- [x] 2.3 `src/TaskManager.jsx`: RED for save-on-change — persist after add/toggle/archive. GREEN: add `useEffect` calling `saveTasksToStorage(tasks)` on `[tasks]`.
- [x] 2.4 `src/TaskManager.jsx`: render archive button (`data-testid="task-archive-button-<id>"`) only on completed tasks; render archive toggle (`data-testid="archive-toggle-button"`), archived section (`data-testid="archived-list"`), and empty state (`data-testid="archived-empty"`).
- [x] 2.5 `src/TaskManager.css`: styles for archive button and archived section (`.archive-button`, `.archived-section`).

## Phase 3: Integration / Wiring

- [x] 3.1 Verify `src/TaskManager.jsx` archives persist flag across unmount/remount (extend `src/__tests__/integration/` for archive-then-remount keeps `archived: true`).

## Phase 4: E2E Verification

- [x] 4.1 Extend `e2e/persistence.spec.ts`: task persists across `page.reload()`; archive a completed task (via `task-archive-button-<id>`) and assert removed from active list.
- [x] 4.2 Add e2e archive toggle spec: activate `archive-toggle-button`, assert `archived-list` shows archived task; assert `archived-empty` when none.

## Phase 5: Cleanup / Verification

- [x] 5.1 Run `npm run lint`, `npm run build`, `npm run test` — all pass.

## TDD Note

strict_tdd=false; order follows wf-tdd (RED failing test before GREEN production per feature). Every task under 400-line single-PR estimate — no chain split needed.

## Verification Evidence (sdd-verify)

| Task | Verified | Evidence |
|------|----------|----------|
| 1.1 taskStorage.js | ✅ | `src/__tests__/taskStorage.test.js` — 9 unit tests pass (missing→[], corrupt→[], non-array→[], normalize archived→false, save writes, quota fallback → false) |
| 1.2 taskStorage.test.js RED/GREEN | ✅ | Covered by 1.1 suite; 9/9 green in `npx vitest run` |
| 2.1 archive integration | ✅ | `task-archive.integration.test.jsx` — archive completed, button only on completed, toggle on/off, empty state — green |
| 2.2 load-on-mount | ✅ | `task-persistence.integration.test.jsx` — corrupt storage, restore on reload — green |
| 2.3 save-on-change | ✅ | persist-after-add, persist-after-toggle assertions — green |
| 2.4 archive button/toggle/section/empty data-testid | ✅ | All 4 data-testid keys present in `TaskManager.jsx`; covered in integration + E2E |
| 2.5 CSS | ✅ | `.archive-button`, `.archived-section` present in `TaskManager.css` |
| 3.1 archive flag across remount | ✅ | `task-archive.integration.test.jsx > keeps an archived flag across unmount and remount` — green |
| 4.1 E2E persistence + archive | ✅ | `e2e/persistence.spec.ts` — reload-keeps-task, archive-removes+persists — 2 E2E green |
| 4.2 E2E archive toggle | ✅ | `e2e/persistence.spec.ts` — toggle reveal/hide + empty-state — 2 E2E green |
| 5.1 lint / build / test | ✅ | `npm run lint` clean, `npm run build` success, `npx vitest run` 20/20, `npx playwright test` 5/5 |

Verification verdict: **PASS** — all 11 tasks verified by runtime execution; see `verify-report.md`.
