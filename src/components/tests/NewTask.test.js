import { render } from '@testing-library/react'
import { createCard } from '../../testUtils'

import NewTask from '../NewTask'

describe("New task", () => {
  const addTask = jest.fn()

  const expectScheduleToBe = schedule => {
    const [task] = addTask.mock.calls[0]
    expect(task.schedule).toBe(schedule)
  }

  beforeEach(() => {
    addTask.mockClear()

    render(<NewTask addTask={addTask} />)
  })

  it('doesn\'t add items with blank descriptions', () => {
    createCard('')
    createCard('\n')

    expect(addTask).not.toHaveBeenCalled()
  })

  it('creates a daily task', () => {
    createCard('Brush teeth', 'DAILY')
    expectScheduleToBe('DAILY')
  })

  it('creates a weekly task', () => {
    createCard('Take out bins', 'WEEKLY')
    expectScheduleToBe('WEEKLY')
  })

  it('creates a twice weekly task', () => {
    createCard('Go to the gym', 'TWICE_WEEKLY')
    expectScheduleToBe('TWICE_WEEKLY')
  })

  it('creates a thrice weekly task', () => {
    createCard('Go to the gym', 'THRICE_WEEKLY')
    expectScheduleToBe('THRICE_WEEKLY')
  })

})