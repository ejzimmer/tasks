import { fireEvent, render, screen } from '@testing-library/react';
import { createCard } from './testUtils'

import App from './App';

Object.defineProperty(window, 'localStorage', {
  value: {
    setItem: jest.fn(),
    getItem: jest.fn()
  }
})

const getTasks = () => Array.from(screen.getByTestId('tasks').querySelectorAll('.task'))
const getTaskDescriptions = () => getTasks().map((_, index) => getTaskDescription(index))
const getTask = (index) => {
  const tasks = getTasks()

  if (index < 0) {
    return tasks[tasks.length + index]
  }

  return tasks[index]
}
const getTaskDescription = (index) => {
  const task = getTask(index)

  const textContent = task.textContent 
  if (textContent) return textContent

  const input = task.querySelector('input[type=text]')
  return input && input.value
}
const clickButton = (text) => {
  const button = screen.queryByLabelText(text) || screen.queryByText(text)
  fireEvent.click(button)
}
const clickEditButton = description => clickButton(`edit task ${description}`)
const clickMoveUpButton = description => clickButton(`move task ${description} up`)
const clickMoveDownButton = description => clickButton(`move task ${description} down`)
const clickMoveToTopButton = description => clickButton(`move task ${description} to top`)
const clickMoveToBottomButton = description => clickButton(`move task ${description} to bottom`)

const setItem = jest.spyOn(localStorage, 'setItem')

describe('the list', () => {
  let INITIAL_TASK_DESCRIPTIONS 

  beforeEach(() => {
    jest.spyOn(localStorage, 'getItem').mockReturnValue(JSON.stringify([{
      id: 1,
      description: 'Wash dishes',
      done: false
    }, {
      id: 2,
      description: 'Mow lawn',
      done: false
    }, {
      id: 3,
      description: 'Cook dinner',
      done: false
    }]))
    INITIAL_TASK_DESCRIPTIONS = JSON.parse(localStorage.getItem()).map(task => task.description)

    render(<App />)
    setItem.mockClear()
  })

  it('adds an item to the list', async () => {
    createCard()
    
    const tasks = getTaskDescriptions()
    expect(tasks).toEqual(['Wash dishes', 'Mow lawn', 'Cook dinner', 'Buy milk'])
    expect(screen.getByTestId('new-task').value).toBe('')  
  })

  it('removes an item from the list', () => {
    clickButton('delete task Wash dishes')
    clickButton('Yes')

    expect(getTaskDescriptions()).toEqual(['Mow lawn', 'Cook dinner'])
  })

  it('shows the number uncompleted items in the list', () => {
    const getNumberOfTasksRemaining = () => screen.getByLabelText('tasks remaining')
    expect(getNumberOfTasksRemaining()).toHaveTextContent('3')

    const firstTask = getTask(0).querySelector('label')
    fireEvent.click(firstTask)
    
    expect(getNumberOfTasksRemaining()).toHaveTextContent('2')
  })

  describe('Moving an item', () => {
    it('allows moving in edit mode', () => {
      const task = getTaskDescription(1)
      const getMoveUpButton = () => screen.queryByLabelText(`move task ${task} up`)
      expect(getMoveUpButton()).not.toBeInTheDocument()

      clickEditButton(task)
      expect(getMoveUpButton()).toBeInTheDocument()

      clickMoveUpButton(task)
      expect(getMoveUpButton()).toBeInTheDocument()

      const editInput = getMoveUpButton().parentNode.parentNode.querySelector('input[type=text]')
      fireEvent.blur(editInput)

      expect(getMoveUpButton()).not.toBeInTheDocument()
    })

    it('doesn\'t move the first task upwards', () => {
      const firstTaskDescription = getTaskDescription(0)
      clickEditButton(firstTaskDescription)

      clickMoveUpButton(firstTaskDescription)
      expect(getTaskDescriptions()).toEqual(INITIAL_TASK_DESCRIPTIONS)

      clickMoveToTopButton(firstTaskDescription)
      expect(getTaskDescriptions()).toEqual(INITIAL_TASK_DESCRIPTIONS)
    })

    it('doesn\'t allow moving the last item down or to the bottom', () => {
      const lastTaskDescription = getTaskDescription(-1)
      clickEditButton(lastTaskDescription)

      clickMoveDownButton(lastTaskDescription)
      expect(getTaskDescriptions()).toEqual(INITIAL_TASK_DESCRIPTIONS)

      clickMoveToBottomButton(lastTaskDescription)
      expect(getTaskDescriptions()).toEqual(INITIAL_TASK_DESCRIPTIONS)
    })

    it('moves an item upwards in the list', () => {
      const lastTaskDescription = getTaskDescription(-1)
      clickEditButton(lastTaskDescription)
      clickMoveUpButton(lastTaskDescription)

      const expectedTasks = ['Wash dishes', 'Cook dinner', 'Mow lawn']
      expect(getTaskDescriptions()).toEqual(expectedTasks)
    })

    it('moves an item downwards in the list', () => {
      const firstTaskDescription = getTaskDescription(0)
      clickEditButton(firstTaskDescription)
      clickMoveDownButton(firstTaskDescription)

      const expectedTasks = ['Mow lawn', 'Wash dishes', 'Cook dinner']
      expect(getTaskDescriptions()).toEqual(expectedTasks)
    })

    it('moves an item to the top of the list', () => {
      const lastTaskDescription = getTaskDescription(-1)
      clickEditButton(lastTaskDescription)
      clickMoveToTopButton(lastTaskDescription)

      const expectedTasks = ['Cook dinner', 'Wash dishes', 'Mow lawn']
      expect(getTaskDescriptions()).toEqual(expectedTasks)
    })

    it('moves an item to the bottom of the list', () => {
      const firstTaskDescription = getTaskDescription(0)
      clickEditButton(firstTaskDescription)
      clickMoveToBottomButton(firstTaskDescription)

      const expectedTasks = ['Mow lawn', 'Cook dinner', 'Wash dishes']
      expect(getTaskDescriptions()).toEqual(expectedTasks)
    })
  })


  describe('storage', () => {
    it('saves in localstorage', () => {
      createCard()
  
      const [key, value] = setItem.mock.calls[0]
      expect(key).toBe('tasks')
      expect(value).toContain('Buy milk')
    })
  
    it('fetches initial state from localstorage', () => {
      const washDishes = screen.getByLabelText('Wash dishes')
      expect(washDishes.checked).toBe(false)

      const mowLawn = screen.getByLabelText('Mow lawn')
      expect(mowLawn.checked).toBe(false)
    })
  
    it('saves the done state', () => {
      const done = screen.getByLabelText('Mow lawn')
      fireEvent.click(done)

      expect(setItem).toHaveBeenCalled()
    })

  })
})



