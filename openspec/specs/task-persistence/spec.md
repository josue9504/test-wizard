# Task Persistence Specification

## Purpose

Ensure the task list survives browser page refreshes by persisting to and loading from localStorage.

## Requirements

### Requirement: Persist tasks to localStorage on every state change

The system SHALL write the full task array to `localStorage` under the key `"tasks"` whenever the task state changes.

#### Scenario: Tasks are saved after adding a new task

- GIVEN a fresh session with no persisted tasks
- WHEN the user adds a task with text "Buy milk"
- THEN `localStorage.getItem("tasks")` contains an array with one entry whose `text` is "Buy milk" and `completed` is `false`
- AND `archived` is `false`

#### Scenario: Tasks are saved after toggling completion

- GIVEN a task "Write tests" that is not completed and is persisted in localStorage
- WHEN the user toggles the task to completed
- THEN `localStorage.getItem("tasks")` contains the task with `completed` set to `true`

### Requirement: Load tasks from localStorage on mount

The system SHALL read the task array from `localStorage` key `"tasks"` when the component mounts and use it to initialize state.

#### Scenario: Existing tasks are restored on page load

- GIVEN localStorage contains a persisted task array with two tasks
- WHEN the page loads and the TaskManager component mounts
- THEN the task list displays both persisted tasks with their original text and completed state

#### Scenario: Corrupt localStorage data is handled gracefully

- GIVEN `localStorage.getItem("tasks")` contains invalid JSON (e.g. `"not-json"`)
- WHEN the TaskManager component mounts
- THEN the task list initializes as an empty array
- AND no error is shown to the user

#### Scenario: Missing localStorage key on first use

- GIVEN `localStorage` has no `"tasks"` key
- WHEN the TaskManager component mounts
- THEN the task list initializes as an empty array
