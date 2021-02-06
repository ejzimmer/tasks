import React, { useState } from 'react'
import './NewTask.css'

const schedules = [
  {
    label: '毎日',
    value: 'DAILY'
  },
  {
    label: '毎週',
    value: 'WEEKLY'
  },
]

export default function NewTask({ addTask }) {
  const [description, setDescription] = useState('')
  const [schedule, setSchedule] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    
    const desc = description.trim()
    if (!desc) return false

    const newTask = {
      id: (new Date()).getTime(),  
      description: desc,
      schedule
    }

    addTask(newTask)
    setDescription('')
    setSchedule('')
  }

  const checkKey = (event) => {
    const { key, shiftKey } = event
    if (key === 'Enter' && !shiftKey) {
      event.preventDefault()
      handleSubmit(event)
    }
  }

  const handleScheduleChange = (event) => {
    const checked = event.currentTarget.checked
    const value = event.currentTarget.value 

    if (schedule === value && !checked) {
      setSchedule('')
    } else if (checked) {
      setSchedule(value)
    }
  }

  return (
    <form className="new-task" onSubmit={handleSubmit}>
      <textarea 
        onChange={(event) => setDescription(event.currentTarget.value)}
        onKeyDown={checkKey}
        value={description} 
        data-testid="new-task" 
        rows={1}  />
        <div className="button-bar">
          <ul className="schedules">
            { schedules.map(({ value, label}) => (<li key={value}>
                <input 
                  type="checkbox" 
                  id={value} 
                  aria-label={value} 
                  checked={schedule === value} 
                  value={value}
                  onChange={handleScheduleChange} />
                <label htmlFor={value}>{label}</label>
              </li>))}
          </ul>
          <button type="submit">submit</button>
        </div>
    </form>
  )
}