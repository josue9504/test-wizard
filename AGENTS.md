
# AGENTS.md — test-wizard — Node.js, React 19.2.8, Vite 8.2.0, JavaScript/JSX, Vitest 4.1.10, Playwright 1.62.1

> **⛔ HARD STOP RULE — always follow wf-orchestrator skill first.**
>
> always follow wf-orchestrator.md skill first. Before classifying, planning, or implementing
> any task, READ `wf-orchestrator` (the project's packaged skill — see Protocol routing below).
> It is the single entry point and source of truth for this project's workflow: it decides the
> gate sequence (Ladder → Preflight → Decision → TDD ritual). If you skipped it, STOP and read
> it before doing anything else.

## Commands

- npm run dev — Start development server
- npm run build — Build for production
- npm run lint — Run ESLint
- npm run preview — Preview production build locally

## Code Style & Conventions

- Naming: camelCase
- Components: React function components with hooks and default exports
- Imports: relative
- Tests: Vitest for unit/integration; Playwright for E2E
- CSS: plain CSS
- State: useState

## Project Structure

src/  # React source code
  __tests__/  # Vitest unit and integration tests
  test/  # Test setup
  assets/  # Application assets
e2e/  # Playwright E2E tests
public/  # Static assets

## Critical Constraints

- Do not commit or push without approval
- Do not install dependencies without approval
- Always write code and comments in English

## Testing Approach

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

## Programmatic Checks

- `npm run lint`
- `npm run build`
- `npm run test`
- `npm run test:coverage` (minimum 80%)
- `npm run test:e2e`

## Project MCPs

| MCP | Active |
|---|---|
| playwright | yes |

## Behavior Preferences

- Review gate before commit: show me the full diff and wait for my approval before committing.
- No opportunistic refactor: stick to the new pattern only in new code.
- If you detect that the code contradicts something in this AGENTS.md, report it at the end of
  your reply with the tag `[AGENTS.md drift detected: <description>]`. Do not correct AGENTS.md yourself.

---

## 🧭 Protocol routing (load on demand)

This project uses packaged protocols that are loaded **only when applicable**, to avoid
bloating the context. They are NOT written in full here — they live in dedicated files.

### Skill paths by IDE/CLI

| IDE/CLI | Global skill path | Project path |
|---|---|---|
| Claude Code | `~/.claude/skills/` | `.claude/skills/` |
| OpenCode | `~/.config/opencode/skills/` | `.opencode/skills/`, `.claude/skills/`, `.agents/skills/` |
| Cursor | `~/.cursor/skills/` | `.cursor/skills/`, `.agents/skills/` (native + universal fallback) |
| Windsurf/Devin | `~/.codeium/windsurf/skills/`, `~/.config/devin/skills/` | `.windsurf/skills/`, `.devin/skills/` |
| Codex CLI | `~/.codex/skills/` | `.codex/skills/` |
| Copilot | `~/.copilot/skills/` | `.github/skills/` |
| Kiro | `~/.kiro/skills/`, `~/.kiro/steering/` | `.kiro/skills/`, `.kiro/steering/` |
| Gemini CLI | `~/.gemini/skills/` | `.gemini/skills/`, `.agents/skills/` (native + universal fallback) |
| Antigravity | `~/.gemini/config/skills/` (canonical), `~/.gemini/antigravity-cli/builtin/skills/`, `~/.gemini/antigravity/skills/`, `~/.gemini/antigravity-ide/skills/` | `.agents/skills/` |

> The wizard's own 7 `wf-*` skills are emitted by the Builder in the project path above
> (native auto-discovery) **plus** `.agents/skills/<n>/SKILL.md` (universal fallback) and the
> flat `.agents/protocols/<n>.md`. Global `wf-*` commands get the same 1:1 from `install.sh`.

### Available protocols

> **Namespace note**: everything prefixed `wf-` below is owned by THIS wizard, never by
> gentle-ai. Anything named `sdd-*` (no `wf-` prefix) is gentle-ai's own — its routing and
> delegation mechanics are gentle-ai's exclusive authority, already installed/synced for your
> IDE. This wizard's own protocols never re-specify HOW gentle-ai delegates or routes.

| When | Protocol to read |
| Before classifying or implementing any task | `wf-orchestrator` — single entry point to this project's own wf- protocols (loads `wf-ladder`) (loads `wf-sdd-trigger`) (loads `wf-tdd`) |
| Before writing tests or code for a feature | `wf-tdd` — TDD Protocol (wizard-owned) |
| When onboarding a new developer | `wf-onboard` — local environment setup (always available) |
| When managing git worktrees | `wf-worktree` — parallel work isolation (always available) |
| When toggling optional modules | `wf-settings` — TDD, testing, ladder, SDD backend (always available) |
| When gentle-ai's SDD was explicitly requested (via `wf-sdd-trigger`'s `wf-force-sdd` outcome) | SDD skills live in your IDE's path (see table above) — **gentle-ai's own**, not this wizard's. **READ them before relying on them** — do not invent the flow, and do not describe how they delegate; that is gentle-ai's own native content for this adapter. Available skills: `sdd-propose`, `sdd-spec`, `sdd-design`, `sdd-tasks`, `sdd-apply`, `sdd-verify`, `sdd-archive`, `sdd-explore`, `sdd-init`, `sdd-onboard` |
| When migrating SDD backend or touching `openspec/config.yaml`'s known fields | `sdd` — wizard-owned rules (persistence backends, Wizard-Allowed Field Edits) — flat file `.agents/protocols/sdd.md` |
| When generating/auditing AGENTS.md | `architecture` — AI context architecture |

> **⚠️ MANDATORY RULE**: Before implementing any change, look for the
> corresponding skill in your IDE's path and READ it. Do NOT invent SDD flows
> or assume you know how it works — the skills contain the exact
> procedure.

> **Universal order**: 🪜 `wf-ladder` (if active) → 🔍 `wf-preflight` (user confirms) → (by outcome) 🧪 `wf-tdd` → implementation.
>
> **No combined PRECHECK**: after the user confirms the `wf-preflight`, proceed directly to the chosen route. Summary of the outcome (details in the `wf-sdd-trigger` protocol):
> - **`wf-no-sdd`**: implement directly (or with 🧪 `wf-tdd` if active). No SDD request needed.
> - **`wf-force-sdd`**: declare the explicit SDD request to gentle-ai via `sdd-new <feature or fix>` (or `/sdd-new` if your adapter only supports native slash syntax). How gentle-ai delegates/executes is entirely its own decision per adapter — never re-specified by this wizard.
> - **`wf-tdd`**: never production code without the mode's TDD ritual (🧪 TDD PROPOSAL in standard / RED→GREEN evidence in strict). On `wf-no-sdd` it goes before implementing. **When `wf-force-sdd` was requested, the `🧪 TDD PROPOSAL` (standard mode) is issued by you (the orchestrator) BEFORE making the `sdd-apply` request — since `sdd-apply` is headless and cannot ask — and only then is the request made with the *baked* decision + a reference to `wf-tdd` (see row above).**

<!-- wf-version: 0.8.42-beta.1 | source: github.com/hugoafj/ai-workflow-wizard | stack: node-react | features: ladder=yes, tdd=yes, routing=yes, ci=yes, cd=no, release=no -->

