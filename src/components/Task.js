import React, { useState, useRef, useEffect } from 'react'

import './Task.css'

const MOVE_BUTTONS = [
  {
    key: 'UP',
    text: 'up',
    Image: () => (<svg height="100%" viewBox="0 0 50 100">
              <path d="M25,0 l0,100" />
              <path d="M0,30 l25,-25 25,25" fill="none" />
            </svg>)
  },
  {
    key: 'DOWN',
    text: 'down',
    Image: () => (<svg height="100%" viewBox="0 0 50 100">
                    <path d="M25,0 l0,100" />
                    <path d="M0,60 l25,25 25,-25" fill="none" />
                  </svg>)
  },
  {
    key: 'TO_TOP',
    text: 'to top',
    Image: () => (<svg height="100%" viewBox="0 0 50 100">
              <path d="M0,10 l100,0" />
              <path d="M25,5 l0,100" />
              <path d="M0,45 l25,-25 25,25" fill="none" />
            </svg>)
  },
  {
    key: 'TO_BOTTOM',
    text: 'to bottom',
    Image: () => (<svg height="100%" viewBox="0 0 50 100">
                    <path d="M25,0 l0,100" />
                    <path d="M0,50 l25,25 25,-25" fill="none" />
                    <path d="M0,90 l100,0" />
                  </svg>)
  }

]

export default function Task({task, deleteTask, updateTask, moveTask}) {
  const [editMode, setEditMode] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const editor = useRef()
  const moveButtons = useRef()

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

  function handleMoveTask(direction) {
    moveTask(task, direction)
    setEditMode(true)
    editor.current.focus()
  }

  function handleBlur(event) {
    const focussedElement = event.relatedTarget
    if (!Array.from(moveButtons.current.childNodes).includes(focussedElement)) {
      setEditMode(false)
    } 
  }

  function checkDelete() {
    setShowConfirmDelete(true)
  }
  function confirmDelete() {
    deleteTask(task.id)
    setShowConfirmDelete(false)
  }
  function cancelDelete() {
    setShowConfirmDelete(false)
  }

  return (
    <div className="task">
      <input id={`task_${task.id}`} type="checkbox" checked={!!task.done} onChange={setTaskDone} />
      { !editMode && <label htmlFor={`task_${task.id}`}>{task.description}</label>}
      { editMode && <input type="text" ref={editor} value={task.description} onChange={updateTaskDescription} onBlur={handleBlur} />}

      { !editMode && (
      <div className="buttons">
        { !task.done && (
          <button className="edit icon" aria-label={`edit task ${task.description}`} onClick={() => setEditMode(true)}>
          <svg width="100%" viewBox="0 0 100 100">
            <path d="M0,80 l0,20 20,0z" />
            <path d="M9,69 l20,20 65,-65 -20,-20" />
          </svg>
          </button>)}
        <button className="icon"
          aria-label={`delete task ${task.description}`} 
          onClick={() => checkDelete()}
        >
          <svg width="100%" viewBox="0 0 100 100">
            <path d="M0,0 l100,100" />
            <path d="M100,0 l-100,100" />
          </svg>
        </button>
        </div>
      )}

      {editMode && (
        <div className="move-buttons" ref={moveButtons}>
          {MOVE_BUTTONS.map(({key, text, Image}) => 
            <button key={key} className="icon" aria-label={`move task ${task.description} ${text}`} onClick={() => handleMoveTask(key)}><Image /></button>)}
        </div>
      )}

      {showConfirmDelete && (
        <div className="modal">
          <h2>Really delete?</h2>
          <div className="side-by-side" style={{marginTop: '20px'}}>
            <button onClick={confirmDelete}>Yes</button>
            <button onClick={cancelDelete}>No</button>
          </div>
        </div>
      )}
    </div>
  )
}