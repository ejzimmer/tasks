import React from 'react'
import { render, fireEvent, screen, act, waitFor } from '@testing-library/react'

import Task from '../Task'

let task
let component

const getEditButton = () => screen.queryByLabelText(/edit task/)
const updateTask = updatedTask => task.description = updatedTask.description

describe('Task component', () => {

  beforeEach(() => {
    task = {
      id: 2,
      description: 'Mow lawn',
      done: false
    }

    component = render(<Task task={task} updateTask={updateTask} />)
  })

  it('edits the description of an item', async () => {
    fireEvent.click(getEditButton())

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Mow lawn and water plants' } })
    fireEvent.blur(input)  
    
    await waitFor(() => expect(screen.getByText(/Mow lawn and water plants/)))
  })

  it('doesn\'t edit completed items', () => {
    task.done = true
    component.rerender()
    expect(getEditButton()).not.toBeInTheDocument()
  })

})