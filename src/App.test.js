import { act, fireEvent, render, screen } from '@testing-library/react';

import App from './App';

Object.defineProperty(window, 'localStorage', {
  value: {
    setItem: jest.fn(),
    getItem: () => JSON.stringify([{
      id: 1,
      description: 'Wash dishes',
      done: true
    }, {
      id: 2,
      description: 'Mow lawn',
      done: false
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
const setItem = jest.spyOn(localStorage, 'setItem')

describe('the list', () => {
  beforeEach(() => {
    render(<App />)
    setItem.mockClear()
  })

  it('adds an item to the list', async () => {
    createCard()

    const tasks = getTasks()
    expect(tasks[tasks.length - 2]).toHaveTextContent('Buy milk')
    expect(screen.getByTestId('new-task').value).toBe('')  
  })

  it('edits the description of an item', () => {
    const editButton = screen.getByLabelText('edit task Mow lawn')
    fireEvent.click(editButton)

    const input = screen.getAllByRole('textbox')[0]
    fireEvent.change(input, { target: { value: 'Mow lawn and water plants' } })
    fireEvent.blur(input)

    const washDishes = screen.getByText(/Mow lawn/)
    expect(washDishes).toHaveTextContent('Mow lawn and water plants')
  })

  it('doesn\'t edit completed items', () => {
    const editButton = screen.queryByLabelText('edit task Wash dishes')
    expect(editButton).not.toBeInTheDocument()
  })

  it('removes an item from the list', () => {
    const washDishes = screen.getByText('Wash dishes')
    const deleteButton = screen.getByLabelText('delete task Wash dishes')

    fireEvent.click(deleteButton)

    expect(washDishes).not.toBeInTheDocument()
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
      expect(washDishes.checked).toBe(true)

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

