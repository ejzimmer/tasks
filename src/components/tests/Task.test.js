import React from 'react'
import { render, fireEvent, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'

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
const getInput = () => screen.getByRole('textbox')

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

  describe('editing tasks', () => {
    it('edits the description of an item', () => {
      clickButton(EDIT_BUTTON)
   
      const input = getInput()
      fireEvent.change(input, { target: { value: 'Mow lawn and water plants' } })
      fireEvent.blur(input)  
      
      const updatedTask = screen.getByText(/Mow lawn and water plants/)
      expect(updatedTask).toBeInTheDocument()
    })
  
    it('doesn\'t edit completed items', () => {
      task.done = true
      component.rerender()
      expect(screen.queryByLabelText(EDIT_BUTTON)).not.toBeInTheDocument()
    })
    
    it('exits edit mode when enter is pressed', async () => {
      clickButton(EDIT_BUTTON)

      const input = getInput()
      fireEvent.keyDown(input, { 
        key: 'Enter',
        shiftKey: false,
      })

      expect(input).not.toBeInTheDocument()
    })
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