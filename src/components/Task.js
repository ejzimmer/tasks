import React from 'react'

export default function Task({task, deleteTask}) {
  return (
    <div className="task">
      {task.description}
      <button 
        aria-label={`delete task ${task.description}`} 
        onClick={() => deleteTask(task.id)}
      />
    </div>
  )
}