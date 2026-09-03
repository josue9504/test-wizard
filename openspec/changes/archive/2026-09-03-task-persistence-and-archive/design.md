# Design: Task Persistence and Archive

## Technical Approach

Add localStorage persistence (capability `task-persistence`) and an archive view (capability `task-archive`) to `TaskManager.jsx`. Persistence logic is extracted into pure helpers in `src/taskStorage.js` (module-oriented, unit-testable without DOM, and already anticipated by the existing `src/__tests__/taskStorage.test.js` which imports `loadTasksFromStorage`, `saveTasksToStorage`, `TASKS_STORAGE_KEY`). Archive behavior lives in `TaskManager` state with derived filtering. Task shape extends to `{ id, text, completed, archived }`.

## Architecture Decisions

| Option | Tradeoff | Decision |
|---|---|---|
| Inline save/load in `TaskManager` vs extracted `src/taskStorage.js` | Inline couples logic to DOM render and duplicates between specs; extracted is pure + unit-testable. | Extract **`src/taskStorage.js`** with pure `loadTasksFromStorage`, `saveTasksToStorage`, `TASKS_STORAGE_KEY`, and a `normalizeTask`/`normalizeTasks` helper. Matches existing test file's imports. |
| Normalization location | Parse-time normalization in `loadTasksFromStorage` vs post-load in component. | Normalize **in `loadTasksFromStorage`** so every loaded task defaults `archived: false` and is validated — single source, covered by unit test, component stays thin. |
| Save timing: `useEffect` on every state change vs explicit save in handlers | Effect guarantees persistence on ALL mutations incl. future handlers; explicit saves are riskier for missed cases. | **`useEffect([tasks])` save-on-change**, with quota-exceeded try/catch falling back to in-memory only. |
| View mode state: boolean `showArchived` vs enum | Enum scales to more views later; boolean is simplest for two views. | **`showArchived` boolean** toggling between active and archived sections. |
| Archive action: `archived: true` keeps task in array | vs removing from array — flag preserves history and persists view. | **Flag approach** with derived filtering `tasks.filter(t => !t.archived)` for active view. |

## Data Flow

```
localStorage "tasks"
      │ loadTasksFromStorage()  (parse + normalize archived:false)
      ▼
useState(tasks) ── useMemo → active = !archived / archived = archived
      │
      │ addTask / toggleTask / archiveTask (setTasks)
      ▼
useEffect([tasks]) → saveTasksToStorage(tasks)  (quota try/catch)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/taskStorage.js` | Create | Pure helpers: `TASKS_STORAGE_KEY` (`"tasks"`), `loadTasksFromStorage` (try/catch parse + normalize `archived:false`), `saveTasksToStorage` (quota-exceeded silent fallback). |
| `src/TaskManager.jsx` | Modify | Add load-on-mount effect, save-on-change effect, `archiveTask`, `showArchived` state, archive button (completed only), archived section + toggle. |
| `src/TaskManager.css` | Modify | Styles for archive button and archived section. |

## Interfaces / Contracts

```js
// src/taskStorage.js
export const TASKS_STORAGE_KEY = 'tasks'

// Task shape
// { id: number, text: string, completed: boolean, archived: boolean }

// loadTasksFromStorage(): Task[]
//   - missing key / invalid JSON / non-array  → []
//   - normalizes: each task gets archived:false if absent

// saveTasksToStorage(tasks: Task[]): boolean
//   - returns false (no throw) when quota exceeded; true on success
```

`data-testid` keys (kebab-case): `task-archive-button-<id>` (per-task, resolved for E2E reliability), `archive-toggle-button`, `archived-list`, `archived-empty`. Interactive elements only.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit (`src/__tests__/taskStorage.test.js`) | load missing/corrupt/valid JSON; normalize absent `archived` → `false`; save writes key; quota fallback returns false | Extend existing file; pure funcs, no DOM |
| Integration (`src/__tests__/integration/`) | load persists across unmount/remount; archive moves task to archived view; archive button only on completed; toggle shows/hides; corrupt storage doesn't crash | Testing Library render + userEvent |
| E2E (`e2e/`) | page reload keeps tasks; archiving removes from active; toggle reveals archived | Playwright pageload/reload via data-testid |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary.

## Migration / Rollout

Existing localStorage arrays lack `archived`. `loadTasksFromStorage` normalizes on read (default `archived:false`); next save persists the normalized shape. No destructive migration, no flags. Rollback = revert `TaskManager.jsx`/`taskStorage.js`; old data remains loadable.

## Open Questions

None — archive-button `data-testid` resolved to per-task format `task-archive-button-<id>` for E2E reliability.
