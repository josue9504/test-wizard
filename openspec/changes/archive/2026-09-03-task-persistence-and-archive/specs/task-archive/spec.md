# Task Archive Specification

## Purpose

Allow users to move completed tasks out of the active list into an archived view, reducing visual clutter while preserving access to completed work.

## Requirements

### Requirement: Archive completed tasks

The system SHALL provide an archive action on completed tasks that moves them out of the active task list.

#### Scenario: Archive a single completed task

- GIVEN a task "Write tests" with `completed: true` and `archived: false`
- WHEN the user clicks the archive button on that task
- THEN the task's `archived` property is set to `true`
- AND the task no longer appears in the active task list

#### Scenario: Archive button only appears on completed tasks

- GIVEN a task "Buy milk" with `completed: false`
- THEN no archive button is rendered for that task

#### Scenario: Non-completed task cannot be archived

- GIVEN a task with `completed: false`
- THEN no archive action is available for that task

### Requirement: View archived tasks

The system SHALL provide a toggle to show or hide archived tasks in a dedicated section.

#### Scenario: Toggle archive view on

- GIVEN there are archived tasks in the task array
- WHEN the user activates the archive view toggle
- THEN a section displaying archived tasks becomes visible
- AND archived tasks show their original text and completed state

#### Scenario: Toggle archive view off

- GIVEN the archive view is visible
- WHEN the user deactivates the archive view toggle
- THEN the archived tasks section is hidden
- AND active tasks remain visible

#### Scenario: Archive view with no archived tasks

- GIVEN there are no archived tasks (`archived: true` does not appear in any task)
- WHEN the user activates the archive view toggle
- THEN the archived tasks section shows an empty state (no tasks listed)

### Requirement: Task shape includes archived flag

The system SHALL represent every task with an `archived` boolean property, defaulting to `false`.

#### Scenario: New tasks default to not archived

- GIVEN a user adds a new task
- WHEN the task is created
- THEN the task object contains `archived: false`

#### Scenario: Archived tasks persist the flag across refreshes

- GIVEN a task has `archived: true` and is persisted to localStorage
- WHEN the page reloads
- THEN the task remains with `archived: true` and appears in the archived section (when toggled on)
