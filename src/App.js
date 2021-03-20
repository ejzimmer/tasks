import { useEffect, useState } from 'react'
import Task from './components/Task'
import NewTask from './components/NewTask'

import './App.css';
import scheduleTasks from './scheduleTasks';

const STORAGE_KEY = 'tasks'

function App() {
  const [tasks, setTasks] = useState(() => {
    const value = localStorage.getItem(STORAGE_KEY) || '[]'

    return scheduleTasks(JSON.parse(value))
  })
  const [previousStates, setPreviousStates] = useState([])

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    }

    const [previousState] = previousStates
    if (previousState !== tasks) {
      setPreviousStates((states) => [tasks, ...states])
    }
  }, [tasks, previousStates])

  const addTask = (newTask) => {
    setTasks([...tasks, newTask])
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

  const handleUndo = () => {
    if (previousStates.length < 2) return

    const previousState = previousStates[1]
    setTasks(previousState)
    setPreviousStates(([_, ...earlierStates]) => earlierStates)
  }

  return (
    <>
      <ul className="day-list" data-testid="tasks">
        {tasks.map(task => (
          <li key={task.id}>
            <Task task={task} updateTask={updateTask} deleteTask={deleteTask} moveTask={moveTask} />
          </li>)
        )}
        <li>
          <NewTask addTask={addTask} />
        </li>
      </ul>
      <div className="tasks-remaining" aria-label="tasks remaining">{tasks.filter(task => !task.done).length}</div>
      <button className="undo-button" aria-label="undo" onClick={handleUndo}>↩️</button>
    </>
  );
}

export default App;
