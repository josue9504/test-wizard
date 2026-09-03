# Proposal: Task Persistence and Archive

## Intent

Tasks in TaskManager are lost on page refresh because state lives only in `useState([])`. Users also have no way to hide completed tasks from the active list. This change adds localStorage persistence and an archive action for completed tasks.

## Scope

### In Scope
- Load tasks from `localStorage` on mount; save on every state change
- Add an "Archive" button on completed tasks that moves them out of the active list
- Archived tasks viewable via a toggle/filter in the same component
- `data-testid` attributes on all new interactive elements

### Out of Scope
- Deleting tasks (no delete feature requested)
- Editing task text after creation
- Multiple lists or categories
- App.jsx wiring — already bypassed; `main.jsx` renders `<TaskManager />` directly

## Capabilities

### New Capabilities
- `task-persistence`: Load/save task list to localStorage; survive page refresh
- `task-archive`: Archive completed tasks to a separate view; remove from active list

### Modified Capabilities

None — no existing specs in `openspec/specs/`.

## Approach

- Add `useEffect` to load from `localStorage` key `"tasks"` on mount
- Add `useEffect` to persist tasks array to `localStorage` on every change
- Extend task shape: `{ id, text, completed, archived }` (default `archived: false`)
- Filter active tasks: `tasks.filter(t => !t.archived)`
- Archive button on each completed task sets `archived: true`
- Toggle button to show/hide archived tasks section
- No external dependencies required

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/TaskManager.jsx` | Modified | Add persistence hooks, archive state, archive button, archived view |
| `src/TaskManager.css` | Modified | Styles for archive button and archived tasks section |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| localStorage quota exceeded | Low | Tasks are small JSON; graceful fallback to in-memory only |
| Corrupt localStorage data | Low | Wrap `JSON.parse` in try/catch; reset to empty array on failure |

## Rollback Plan

Revert `TaskManager.jsx` to the `useState([])`-only version (49 lines). Remove any added CSS. No data migration needed — localStorage is additive.

## Dependencies

- None. No new packages required.

## Success Criteria

- [ ] Tasks survive page refresh (verified via Vitest + Playwright)
- [ ] Completed tasks can be archived and disappear from active list
- [ ] Archived tasks are viewable in a dedicated section
- [ ] Corrupt localStorage does not crash the app
- [ ] All interactive elements have `data-testid` attributes
- [ ] `npm run lint`, `npm run build`, `npm run test` pass
