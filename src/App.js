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

  const [dragee, setDragee] = useState()
  const [dragPosition, setDragPosition] = useState()

  useEffect(() => {
    if (tasks.length > 0)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const updateTaskDescription = (event) => {
    setNewTask(event.target.value)
  }

  const addTask = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      const newTask = {
        id: (new Date()).getTime(),  
        description: event.target.value
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

  const handleDrag = (event) => {
    console.log(event.clientY)
    setDragPosition(event.clientY)
  }

  const handleDragEnd = () => {
    const positions = Array.from(document.querySelectorAll('.day-list li')).map(item => item.getBoundingClientRect().top)

    let newIndex 
    if (dragPosition > positions[positions.length - 1])
      newIndex = positions.length
    else
      newIndex = positions.findIndex((pos, index) => pos <= dragPosition && positions[index + 1] > dragPosition) + 1
    
    setTasks(tasks => {
      const unmovedTasks = tasks.filter(task => task !== dragee)
      return [
          ...unmovedTasks.slice(0, newIndex),
          dragee,
          ...unmovedTasks.slice(newIndex)
        ].filter(x => !!x)
    })
  }

  return (
    <>
      <ul className="day-list" onDragOver={handleDrag}>
        {tasks.map(task => (
          <li key={task.id} draggable onDragStart={() => setDragee(task)} onDragEnd={handleDragEnd}>
            <Task task={task} updateTask={updateTask} deleteTask={deleteTask} />
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
