import React from 'react'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'

import Task from '../Task'

let task
let component

const EDIT_BUTTON = /edit task/
const DELETE_BUTTON = /delete task/

const updateTask = updatedTask => task.description = updatedTask.description
const clickButton = (buttonText) => {
  const button = screen.queryByText(buttonText) || screen.queryByLabelText(buttonText)
  fireEvent.click(button)
}

describe('Task component', () => {
  let deleteTaskSpy

  beforeEach(() => {
    task = {
      id: 2,
      description: 'Mow lawn',
      done: false
    }

    deleteTaskSpy = jest.fn()
    component = render(<Task task={task} updateTask={updateTask} deleteTask={deleteTaskSpy} />)
  })

  it('edits the description of an item', async () => {
    clickButton(EDIT_BUTTON)
 
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Mow lawn and water plants' } })
    fireEvent.blur(input)  
    
    await waitFor(() => expect(screen.getByText(/Mow lawn and water plants/)))
  })

  it('doesn\'t edit completed items', () => {
    task.done = true
    component.rerender()
    expect(screen.queryByLabelText(EDIT_BUTTON)).not.toBeInTheDocument()
  })

  describe('deleting tasks', () => {
    let confirmDialog

    beforeEach(() => {
      clickButton(DELETE_BUTTON)
      confirmDialog = screen.getByText('Really delete?')
    })

    it('confirms delete', () => {
      expect(confirmDialog).toBeInTheDocument()
    })
  
    it('deletes on confirmation', () => {
      clickButton(/Yes/)
      expect(deleteTaskSpy).toHaveBeenCalled()
      expect(confirmDialog).not.toBeInTheDocument()
    })

    it('doesn\'t delete without confirmation', () => {
      clickButton(/No/)
      expect(deleteTaskSpy).not.toHaveBeenCalled()
      expect(confirmDialog).not.toBeInTheDocument()
    })
  })


})