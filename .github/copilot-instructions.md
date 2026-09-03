# GitHub Copilot Instructions — test-wizard

Node.js, React 19.2.8, Vite 8.2.0, JavaScript/JSX, Vitest 4.1.10, Playwright 1.62.1. You are the coding agent for this repo.
These instructions are ALWAYS in effect for every request. Follow them before doing anything.
AGENTS.md is the canonical source of this project's conventions and commands; these instructions
inline the same facts so no extra reads are required — consult AGENTS.md only if a project detail
is missing below.

---

## ⛔ MANDATORY WORKFLOW GATE (before ANY edit, write, or generation)

This project has these wizard features **ACTIVE** (from `.wizard-state.json`). Do NOT re-detect
them, do NOT search for config, do NOT mark them `n/a`:

| Feature | Status | What it requires |
|---|---|---|
| `wf-ladder` | ACTIVE | Emit the 7-rung analysis and STOP for confirmation (below) |
| `wf-sdd-trigger` (routing) | ACTIVE | Classify the route, emit `wf-preflight`, STOP for confirmation |
| `wf-tdd` | ACTIVE (standard) | Emit the TDD PROPOSAL before any production code |

Before you write, edit, or generate any file, you MUST visibly satisfy this checklist in your reply:

```
GATE CONFIRMATION CHECKLIST:
  [ ] wf-ladder completed (7 rungs declared aloud, stopped at first "yes") → [✓/✗]
  [ ] wf-sdd-trigger shown and user chose the outcome (wf-no-sdd / wf-force-sdd) → [✓/✗]
  [ ] wf-preflight displayed with decision visible                          → [✓/✗]
  [ ] wf-tdd ritual DONE (TDD PROPOSAL emitted) → [✓/✗]
Rules:
- IF ANY is ✗ → STOP. Do not edit. Wait for explicit user confirmation.
- An active feature MUST be completed. "n/a" is NEVER valid for an active feature.
- Output this checklist block VERBATIM in every substantive reply, before any other content.
  Marking gates "done" in a to-do list or "internally" is NOT compliance, and a to-do list is
  NOT a substitute for this block.
```

### Hard rule: one turn = one action

- A turn that requests confirmation MUST NOT contain any file edit. End the turn with the
  request and STOP.
- Only after the user replies with an explicit confirmation ("sí", "continue", "dale", etc.)
  may the next turn apply changes.
- If you already edited without the gate: STOP, surface exactly what you changed, and ask
  whether to keep it or revert. Never continue editing "to make up for it".

---

## 🪜 wf-ladder (ACTIVE — run it first, before classifying)

Walk the rungs top to bottom, stop at the first "yes", declare each evaluated rung aloud with
its answer, then STOP and wait for the user to confirm the rungs.

| Rung | Question | If yes |
|---|---|---|
| 1 | Does this really need to exist? | Skip it |
| 2 | Does it already exist in this codebase? | Reuse it instead of rewriting |
| 3 | Does the language's standard library already do it? | Use the standard library |
| 4 | Is it a native platform feature? | Use the native approach |
| 5 | Is there an already installed dependency that works? | Use it |
| 6 | Can it be done in a single line? | Do it in one line |
| 7 | (only if none above apply) | Write the minimum necessary code that works |

Emit this and stop:

```
🪜 WF-LADDER
  1. Does it need to exist? → <answer and brief reason>
  2. Does it already exist in the code? → <answer and brief reason>
  ...
  ✓ Rung N — <what is used or done and why>
Review these rungs and say "continue" or "no, let me clarify X".
```

## 🔍 wf-sdd-trigger (ACTIVE — only AFTER the ladder is confirmed)

Classify the change and emit the preflight, then STOP for confirmation:

| Route | When | What the confirmation authorizes |
|---|---|---|
| **`wf-no-sdd`** | UI/style tweaks, icons, single-component or layout changes, mechanical edits, 2–3 files without new abstractions | TDD ritual → implement directly |
| **`wf-force-sdd`** | Cross-cutting architecture, new subsystems, uncertain scope, or the user explicitly says "usa SDD" | SDD pipeline: `sdd-new <feature>` → propose → spec → design → tasks → TDD proposal → `sdd-apply` |

```
🔍 WF-SDD-TRIGGER
  Criterion applied: <why this change is no-sdd or force-sdd>
  Proposal: <wf-no-sdd | wf-force-sdd>
  Confirm? [sí → proceed | no → clarify]
```

### Route contract — what "confirm" actually authorizes

**After the user confirms `wf-no-sdd`:**
1. wf-tdd: emit the TDD PROPOSAL and wait for confirmation.
2. Write the test (red) → implement (green) → run the project's tests.

**After the user confirms `wf-force-sdd`:**
1. Your NEXT action is to run gentle-ai's SDD pipeline: invoke `sdd-new <feature or fix>` with
   the user's request as the input (the `sdd-*` skills are installed for this IDE at
   `~/.copilot/skills/` and `~/.agents/skills/`). This yields propose → spec → design → tasks.
2. Until `sdd-tasks` has produced tasks, you are FORBIDDEN from writing or editing ANY test or
   code file. "usa SDD" means start the SDD pipeline — it does NOT mean "write tests first".
3. Only after `sdd-tasks` completes: emit the 🧪 TDD PROPOSAL, wait for confirmation, then invoke `sdd-apply` (it is headless and cannot ask).
4. Do NOT skip or reorder steps. Writing tests/UI first and never running SDD breaks the
   workflow — the order above is binding.

If an `sdd-*` skill does not surface automatically, state it explicitly ("invoking skill
sdd-propose"), and read/apply its SKILL.md. If you truly cannot load it, STOP and tell the user
that SDD cannot run in this IDE.

## 🧪 wf-tdd (ACTIVE — standard mode)

Never write production code without the TDD ritual:

1. Emit a `🧪 TDD PROPOSAL`: which test(s) you will write first, and which behavior they pin.
2. Wait for user confirmation.
3. Write the test(s), run them to see them fail (red), then implement (green).

Where the ritual sits depends on the confirmed route:
- After `wf-no-sdd`: FIRST, before any implementation.
- After `wf-force-sdd`: BETWEEN `sdd-tasks` and `sdd-apply` — never earlier, because `sdd-apply`
  is headless and cannot ask, and SDD must shape the tasks before TDD pins their behavior.

`sdd-*` skills are gentle-ai's own, not this wizard's; read their SKILL.md if you invoke them.

---

## Project facts (always apply)

### Commands

- npm run dev — Start development server
- npm run build — Build for production
- npm run lint — Run ESLint
- npm run preview — Preview production build locally

### Code Style & Conventions

- Naming: camelCase
- Components: React function components with hooks and default exports
- Imports: relative
- Tests: Vitest for unit/integration; Playwright for E2E
- CSS: plain CSS
- State: useState

### Layout

src/  # React source code
  __tests__/  # Vitest unit and integration tests
  test/  # Test setup
  assets/  # Application assets
e2e/  # Playwright E2E tests
public/  # Static assets

### Testing Approach

### Unit & Integration

Run the unit/integration suite before considering a change done:

```bash
npm run test
```

- Unit: one test file next to the code it covers (`Component.test.tsx` next to the component).
- Integration: real render tests in `src/__tests__/integration/` (`*.integration.test.tsx`).

### E2E

Run the end-to-end suite (specs by flow) before merge:

```bash
npm run test:e2e
```

- One spec file per user flow, named by the flow — not by the component or hook.
- Specs live in `e2e/<feature-name>.spec.ts` (examples: `persistence.spec.ts`, `task-creation.spec.ts`).
- Page objects live in `e2e/pages/` — one class per screen; specs never hold raw selectors.

### `data-testid` convention (mandatory on interactive components)

Every element that an E2E test interacts with (buttons, inputs, links,
clickable elements) MUST have its own `data-testid` attribute, added
by the agent when creating the component — not added afterwards, retroactively,
only when a test needs it.

Format: `data-testid="<context>-<element>"`, in kebab-case, specific
without being redundant. Examples: `data-testid="task-item-delete-button"`,
`data-testid="category-filter-select"`.

Why: without this, E2E specs look for elements by visible text or
Tailwind classes — both change frequently during normal development and
break tests unrelated to the actual change. `data-testid` is
stable against style or copy refactors.

Do not confuse with internal `data-*` attributes from third-party libraries
(e.g., `data-radix-scroll-area-viewport` from Radix UI) — those are internal
library mechanisms, not the project's testing convention.

### Project MCPs

| MCP | Active |
|---|---|
| playwright | yes |

### Critical constraints

- Do not commit or push without approval
- Do not install dependencies without approval
- Always write code and comments in English

### Validate before done

- `npm run lint`
- `npm run build`
- `npm run test`
- `npm run test:e2e`

---

## Deep-dive references (only when the inline gates above leave a question)

- `.github/skills/wf-orchestrator/SKILL.md` — entry point to the wizard's protocols.
- `.github/skills/wf-ladder/SKILL.md`.
- `.github/skills/wf-sdd-trigger/SKILL.md`.
- `.github/skills/wf-tdd/SKILL.md`.
- Registered `/` commands in this repo:
  - `/wf-orchestrator`
  - `/wf-ladder`
  - `/wf-sdd-trigger`
  - `/wf-tdd`
  - `/wf-worktree`, `/wf-settings`, `/wf-onboard`

<!-- wf-version: 0.8.42-beta.1 | source: github.com/hugoafj/ai-workflow-wizard | stack: node-react | features: ladder=yes, tdd=yes, routing=yes, ci=yes, cd=no, release=no -->
