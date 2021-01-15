import React, { useState, useRef, useEffect } from 'react'

import './Task.css'

export default function Task({task, deleteTask, updateTask}) {
  const [editMode, setEditMode] = useState(false)
  const editor = useRef()

  useEffect(() => {
    if (editMode && editor.current)
      editor.current.focus()
  }, [editMode])

  function setTaskDone() {
    const done = !task.done
    updateTask({
      ...task,
      done
    })
  }

  function updateTaskDescription(event) {
    const description = event.target.value
    updateTask({
      ...task,
      description
    })
  }

  return (
    <div className="task">
      <input id={`task_${task.id}`} type="checkbox" checked={!!task.done} onChange={setTaskDone} />
      { !editMode && <label htmlFor={`task_${task.id}`}>{task.description}</label>}
      { editMode && <input type="text" ref={editor} value={task.description} onChange={updateTaskDescription} onBlur={() => setEditMode(false)} />}

      <div className="buttons">
      <button 
        aria-label={`delete task ${task.description}`} 
        onClick={() => deleteTask(task.id)}
      >
        <svg width="100%" viewBox="0 0 100 100">
          <path d="M0,0 l100,100" />
          <path d="M100,0 l-100,100" />
        </svg>
      </button>
      { !task.done && (
        <button className="edit" aria-label={`edit task ${task.description}`} onClick={() => setEditMode(true)}>
        <svg width="100%" viewBox="0 0 100 100">
          <path d="M0,80 l0,20 20,0z" />
          <path d="M9,69 l20,20 65,-65 -20,-20" />
        </svg>
        </button>)}
      </div>
    </div>
  )
}