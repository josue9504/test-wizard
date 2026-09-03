import { useState, useEffect } from 'react'
import './TaskManager.css'
import {
  loadTasksFromStorage,
  saveTasksToStorage,
} from './taskStorage'

function TaskManager() {
  // Initialize state from persisted tasks (lazy initializer, runs once on mount).
  const [tasks, setTasks] = useState(loadTasksFromStorage)
  const [input, setInput] = useState('')
  const [showArchived, setShowArchived] = useState(false)

  // Persist tasks on every change.
  useEffect(() => {
    saveTasksToStorage(tasks)
  }, [tasks])

  const addTask = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    setTasks([...tasks, { id: Date.now(), text: input.trim(), completed: false, archived: false }])
    setInput('')
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const archiveTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, archived: true } : t))
  }

  const activeTasks = tasks.filter(t => !t.archived)
  const archivedTasks = tasks.filter(t => t.archived)

  return (
    <div className="task-manager">
      <h1>Task Manager</h1>
      <form onSubmit={addTask}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task"
          data-testid="task-input"
        />
        <button type="submit" data-testid="task-add-button">Add</button>
      </form>

      <ul>
        {activeTasks.map(task => (
          <li key={task.id}>
            <label className={task.completed ? 'completed' : ''}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                data-testid={`task-toggle-${task.id}`}
              />
              {task.text}
              {task.completed && (
                <button
                  type="button"
                  className="archive-button"
                  onClick={() => archiveTask(task.id)}
                  data-testid={`task-archive-button-${task.id}`}
                >
                  Archive
                </button>
              )}
            </label>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="archive-toggle"
        onClick={() => setShowArchived(!showArchived)}
        data-testid="archive-toggle-button"
      >
        {showArchived ? 'Hide archived' : 'Show archived'}
      </button>

      {showArchived && (
        <section className="archived-section">
          <h2>Archived</h2>
          {archivedTasks.length > 0 ? (
            <ul data-testid="archived-list">
              {archivedTasks.map(task => (
                <li key={task.id} className={task.completed ? 'completed' : ''}>
                  {task.text}
                </li>
              ))}
            </ul>
          ) : (
            <p data-testid="archived-empty">No archived tasks.</p>
          )}
        </section>
      )}
    </div>
  )
}

export default TaskManager
