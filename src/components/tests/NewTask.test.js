import { render } from '@testing-library/react'
import { createCard } from '../../testUtils'

import NewTask from '../NewTask'

describe("New task", () => {
  const addTask = jest.fn()

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
    createCard('Brush teeth', 'daily')

    const [task] = addTask.mock.calls[0]
    expect(task.schedule).toBe('DAILY')
  })

})