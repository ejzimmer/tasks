import { act, fireEvent, render, screen } from '@testing-library/react';

import App from './App';

Object.defineProperty(window, 'localStorage', {
  value: {
    setItem: jest.fn(),
    getItem: () => JSON.stringify([{
      id: 1,
      description: 'Wash dishes'
    }, {
      id: 2,
      description: 'Mow lawn'
    }])
  }
})

function createCard() {
  act(() => {
    const input = screen.getByTestId('new-task')
    fireEvent.keyDown(input, { 
      key: 'Enter',
      shiftKey: false,
      target: {
        value: 'Buy milk'
      }
    })
  })
}

const getTasks = () => screen.getAllByRole('listitem')

describe('the list', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('adds an item to the list', async () => {
    createCard()

    const tasks = getTasks()
    expect(tasks[tasks.length - 2]).toHaveTextContent('Buy milk')
    expect(tasks[tasks.length - 1].querySelector('textarea').value).toBe('')  
  })

  it('removes an item from the list', () => {
    const tasks = getTasks()
    expect(tasks.length).toBe(3)

    const deleteButton = screen.getByLabelText('delete task Wash dishes')
    fireEvent.click(deleteButton)

    const updatedTasks = getTasks()
    expect(updatedTasks.length).toBe(2)
  })

  describe('storage', () => {
    it('saves in localstorage', () => {
      const setItem = jest.spyOn(localStorage, 'setItem')
      setItem.mockClear()
  
      createCard()
  
      const [key, value] = setItem.mock.calls[0]
      expect(key).toBe('tasks')
      expect(value).toContain('Buy milk')
    })
  
    it('fetches initial state from localstorage', () => {
      const tasks = getTasks()
      expect(tasks.length).toBe(3) // 2 tasks + new task card
    })
  
  })
})

