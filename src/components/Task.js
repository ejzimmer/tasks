import React from 'react'

import './Task.css'

export default function Task({task, deleteTask, updateTask}) {
  function setTaskDone() {
    const done = !task.done
    updateTask({
      ...task,
      done
    })
  }

  return (
    <div className="task">
      <input id={`task_${task.id}`} type="checkbox" checked={!!task.done} onChange={setTaskDone} />
      <label htmlFor={`task_${task.id}`}>{task.description}</label>

      <button 
        aria-label={`delete task ${task.description}`} 
        onClick={() => deleteTask(task.id)}
      >
        <svg width="100%" viewBox="0 0 100 100">
          <path d="M0,0 l100,100" />
          <path d="M100,0 l-100,100" />
        </svg>
        </button>
    </div>
  )
}