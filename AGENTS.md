<!--
  This is the AGENTS.md template that the Builder (wf-init/lib/builder.md) writes to
  the target project. It is a THIN ROUTER (constraint 7): only global policies,
  project-specific content and routing to packaged protocols. It NEVER contains
  the full protocols (Decision Ladder, Local Orchestration, TDD) — those live in
  .claude/skills/<n>/ and .agents/protocols/<n>.md, and the router points to them.

  The {{PLACEHOLDERS}} are filled deterministically from .wizard-state.json.
  The  blocks are conditionals that the Builder resolves by state (not by
  model judgment).
-->

# AGENTS.md — test-wizard — React 19.2.8, Vite 8.2.0, Vitest 4.1.10, Playwright 1.62.1

## Commands

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run test`
- `npm run test:coverage`
- `npm run test:e2e`  <!-- exact commands with real flags detected from manifest -->

## Code Style & Conventions

- JavaScript React function components (`.jsx`) with hooks
- 2-space indentation, semicolon-free style
- Component-local CSS files (`*.css`) with className-based styling
- Relative imports inside `src/`  <!-- only non-obvious things, from reverse engineering + answers -->

## Project Structure

- `src/main.jsx`: app bootstrap
- `src/App.jsx`: root composition
- `src/TaskManager.jsx`: primary feature component
- `src/__tests__/`: unit/integration tests
- `e2e/`: Playwright end-to-end specs
- `openspec/`: SDD specs and change records  <!-- short tree, main folders and their purpose -->

## Critical Constraints

  <!-- what the agent must NOT do + sensitive versions -->


## Testing Approach

<!-- Insert testing-approach.section.md from the testing protocol, adapted to the stack -->
- Unit: Vitest + Testing Library. `npm run test`. File: `Component.test.tsx` next to the component.
- Integration: Vitest + Testing Library with real render. `npm run test`. File: `*.integration.test.tsx` in `src/__tests__/integration/`.
- E2E: Playwright (Chromium). `npm run test:e2e`. Specs in `e2e/<feature-name>.spec.ts`.
  One file per user flow, named by the flow — not by the component or hook.
  Examples: `persistence.spec.ts`, `task-creation.spec.ts`, `categories.spec.ts`.



## Programmatic Checks

- `npm run lint`
- `npm run build`
- `npm run test`
- `npm run test -- --coverage`
- `npm run test:e2e`  <!-- lint + build (+ test/test:e2e per state.testing) -->

## Project MCPs

<!--
  This section is read by /wf-onboard to know which MCPs to configure on each machine.
  It is built according to state.discovery.stack and state.testing (see architecture protocol).
-->
| MCP | Purpose |
|---|---|
| `engram` | Persistent memory across sessions. |
| `context7` | Framework/library docs and API reference lookup. |
| `playwright` | Browser automation and E2E verification for real user flows. |


## Behavior Preferences

<!-- VERBATIM from the architecture protocol (Behavior Preferences). Always written. -->
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
| Cursor | `~/.cursor/skills/` | `.cursor/skills/` |
| Windsurf | `~/.codeium/windsurf/skills/` | `.windsurf/skills/` |
| Codex CLI | `~/.codex/skills/` | `.codex/skills/` |
| Copilot | `~/.copilot/skills/` | `.github/skills/` |
| Kiro | `~/.kiro/skills/`, `~/.kiro/steering/` | `.kiro/skills/`, `.kiro/steering/` |
| Gemini CLI | `~/.gemini/skills/` | `.gemini/skills/`, `.agents/skills/` |
| Antigravity | `~/.gemini/antigravity/skills/`, `~/.gemini/antigravity-ide/skills/`, `~/.gemini/antigravity-cli/skills/` | `.agents/skills/` |

### Available protocols

| When | Protocol to read |

| Before classifying or implementing any task | `decision-ladder` — Decision Ladder + Local Orchestration (Routes A/B/C, Preflight, Route B Lock, Precheck) |


| Before writing tests or code for a feature | `tdd` — TDD Protocol |


| On Route B or C — SDD pipeline | SDD skills live in your IDE's path (see table above). **READ them before delegating** — do not invent the flow. Available skills: `sdd-propose`, `sdd-spec`, `sdd-design`, `sdd-tasks`, `sdd-apply`, `sdd-verify`, `sdd-archive`, `sdd-explore`, `sdd-init`, `sdd-onboard` |
| When initializing SDD or migrating backend | `sdd` — SDD Protocol |

| When generating/auditing AGENTS.md | `architecture` — AI context architecture |

> **⚠️ MANDATORY RULE**: Before implementing any change, look for the
> corresponding skill in your IDE's path and READ it. Do NOT invent SDD flows
> or assume you know how it works — the skills contain the exact
> procedure.


> **Universal order**: 🪜 Decision Ladder → 🔍 Preflight → (by route) 🧪 TDD → implementation.
>
> **✅ Single gate — paste the PRECHECK before production code**: just before touching
> any production file (or starting SDD on Route C), paste the **`✅ PRECHECK
> PRE-IMPLEMENTATION`** block from the `decision-ladder` protocol (Section 5) with each item resolved. If
> any applicable item is ✗ or not done, STOP. It is an EXTERNAL gate: if you did not paste it,
> you did not start. Summary of its items (details in the `decision-ladder` protocol):
> - **Preflight**: mandatory on all routes (including A), with visible Route + Impact Analysis. The decision tree is calculated silently (do not paste it as Q1/Q2/Q3). The Ladder does not replace it.
> - **Route B**: the SDD Lite Checklist is an external gate (one ✗ → Route C); show the locking menu and STOP to wait for the user's choice before code. The `/sdd-lite` command delegates each phase to the corresponding sub-agent using the IDE's native delegation mechanism (`task()`, `spawn_agent()`, `run_subagent()`, etc.).
> - **Route C**: you declare the mandatory start of the SDD pipeline and delegate to gentle-ai's SDD skills; no inline proposal, no direct implementation, no TDD Proposal at pipeline level. Delegate using the IDE's native delegation mechanism (`task()`, `spawn_agent()`, `run_subagent()`, etc.).

> - **TDD**: never production code without the mode's TDD ritual (🧪 TDD PROPOSAL in standard / RED→GREEN evidence in strict). On Route A it goes before implementing. **On B/C the `🧪 TDD PROPOSAL` (standard mode) is issued by the ORCHESTRATOR before delegating to `sdd-apply` — which is headless and cannot ask — and only then delegates with the *baked* decision + injected `tdd-protocol` (see row above).** Real bug fixed: Route C was doing it and TDD ran; Route B/SDD Lite delegated without emitting the proposal.





<!-- The following HTML comment is mandatory and must remain as the LAST LINE of the
     file, as-is, with real values (read by /wf-settings and /wf-refresh by reading
     the full line `features:.*`; if missing, both commands treat all features
     as unknown). -->
<!-- wf-version: v0.4.1-beta.1 | source: github.com/hugoafj/ai-workflow-wizard | stack: node-react | features: ladder=yes, tdd=yes, routing=yes, ci=yes, cd=no, release=yes -->
