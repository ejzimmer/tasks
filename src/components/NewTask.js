import React, { useState } from 'react'
import './NewTask.css'

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
      <input 
        type="checkbox" 
        id="daily" 
        aria-label="daily" 
        checked={schedule === 'DAILY'} 
        value="DAILY" 
        onChange={handleScheduleChange} />
      <label htmlFor="daily">毎日</label>
      <button type="submit">submit</button>
    </form>
  )
}