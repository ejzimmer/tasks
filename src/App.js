import { useEffect, useState } from 'react'
import Task from './components/Task'

import './App.css';

const STORAGE_KEY = 'tasks'

function App() {
  const [newTask, setNewTask] = useState('')
  const [tasks, setTasks] = useState(() => {
    const value = localStorage.getItem(STORAGE_KEY)
    return value ? JSON.parse(value) : []
  })

  useEffect(() => {
    if (tasks.length > 0)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const updateTaskDescription = (event) => {
    setNewTask(event.target.value)
  }

  const addTask = (event) => {
    if (event.key == 'Enter' && !event.shiftKey) {
      const newTask = {
        id: (new Date()).getTime(),  
        description: event.target.value
      }

      setTasks([...tasks, newTask])
      setNewTask('')
    }
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  return (
    <ul className="day-list">
      {tasks.map(task => <li key={task.id}><Task task={task} deleteTask={deleteTask} /></li>)}
      <li style={{ height: '100%' }}>
        <textarea 
          onChange={updateTaskDescription} 
          value={newTask} 
          onKeyDown={addTask} 
          data-testid="new-task" 
          rows={1} 
          className="new-task" />
      </li>
    </ul>
  );
}

export default App;
