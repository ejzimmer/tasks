import { useEffect, useState } from 'react'
import Task from './components/Task'

import './App.css';

const STORAGE_KEY = 'tasks'

function App() {
  const [newTask, setNewTask] = useState('')
  const [tasks, setTasks] = useState(() => {
    const value = localStorage.getItem(STORAGE_KEY)
    return (value ? JSON.parse(value) : []).filter(task => !!task.description)
  })

  useEffect(() => {
    if (tasks.length > 0)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const updateTaskDescription = (event) => {
    setNewTask(event.target.value)
  }

  const addTask = (event) => {
    const description = event.target.value
    if (event.key === 'Enter' && !event.shiftKey && description) {
      event.preventDefault()
      const newTask = {
        id: (new Date()).getTime(),  
        description
      }

      setTasks([...tasks, newTask])
      setNewTask('')
    }
  }

  const updateTask = (task) => {
    setTasks((tasks) => {
      const index = tasks.findIndex(t => t.id === task.id)
      return [
        ...tasks.slice(0, index),
        task,
        ...tasks.slice(index + 1)
      ]
    })
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const moveTask = (task, direction) => {
    setTasks((tasks) => {
      const index = tasks.findIndex(t => t.id === task.id)
      if ((index === 0 && direction === 'UP') || (index === tasks.length - 1 && direction === 'DOWN'))
        return tasks
      
      switch(direction) {
        case 'UP':
          return [
            ...tasks.slice(0, index - 1),
            task,
            tasks[index - 1],
            ...tasks.slice(index + 1)
          ]
        case 'TO_TOP':
          return [
            task,
            ...tasks.slice(0, index),
            ...tasks.slice(index + 1)
          ]
        case 'DOWN':
          return [
            ...tasks.slice(0, index),
            tasks[index + 1],
            task,
            ...tasks.slice(index + 2)
          ]
        case 'TO_BOTTOM':
          return [
            ...tasks.slice(0, index),
            ...tasks.slice(index + 1),
            task
          ]
        default:
          return tasks
      }
    })
  }

  return (
    <>
      <ul className="day-list">
        {tasks.map(task => (
          <li key={task.id}>
            <Task task={task} updateTask={updateTask} deleteTask={deleteTask} moveTask={moveTask} />
          </li>)
        )}
        <li>
          <textarea 
            onChange={updateTaskDescription} 
            value={newTask} 
            onKeyDown={addTask} 
            data-testid="new-task" 
            rows={1} 
            className="new-task" />
        </li>
      </ul>
      <div className="tasks-remaining" aria-label="tasks remaining">{tasks.filter(task => !task.done).length}</div>
    </>
  );
}

export default App;
