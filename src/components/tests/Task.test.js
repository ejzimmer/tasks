import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { sub } from 'date-fns';


import Task from '../Task'

let task

const EDIT_BUTTON = /edit task/
const DELETE_BUTTON = /delete task/

const clickButton = (buttonText) => {
  const button = screen.queryByText(buttonText) || screen.queryByLabelText(buttonText)
  fireEvent.click(button)
}
const getInput = () => screen.getByRole('textbox')

const now = Date.now()
Date.now = () => now
const yesterday = sub(now, { days: 1 })

let deleteTaskSpy
let updateTaskSpy

const setup = (props) => {
  task = {
    id: 2,
    description: 'Mow lawn',
    done: false,
    ...props
  }

  deleteTaskSpy = jest.fn()
  updateTaskSpy = jest.fn()
  render(<Task task={task} updateTask={updateTaskSpy} deleteTask={deleteTaskSpy} />)
}

describe('Task component', () => {

  describe('marking a task as done', () => {

    const markAsDone = () => {
      const checkbox = screen.getByLabelText('Mow lawn')
      fireEvent.click(checkbox)
    }

    const expectDoneUpdate = (doneAt) => {
      expect(updateTaskSpy).toHaveBeenCalledWith({
        ...task,
        done: true,
        doneAt
      })
    }

    it('sets done and doneAt', () => {
      setup()
      markAsDone()

      expectDoneUpdate(now)
    })

    it('creates a doneAt array when the schedule is twice weekly', () => {
      setup({ schedule: 'TWICE_WEEKLY' })
      markAsDone()

      expectDoneUpdate([now])
    })

    it('adds to the doneAt array if it already exists', () => {
      setup({
        schedule: 'TWICE_WEEKLY',
        doneAt: [yesterday]
      })
      markAsDone()

      expectDoneUpdate([yesterday, now])
    })

    it('creates a doneAt array when the schedule is thrice weekly', () => {
      setup({ schedule: 'THRICE_WEEKLY' })
      markAsDone()

      expectDoneUpdate([now])
    })
  })

  describe('editing tasks', () => {
    it('edits the description of an item', () => {
      setup()
      clickButton(EDIT_BUTTON)
   
      const input = getInput()
      fireEvent.change(input, { target: { value: 'Mow lawn and water plants' } })
      fireEvent.blur(input)  

      expect(updateTaskSpy).toHaveBeenCalled()
    })
  
    it('doesn\'t edit completed items', () => {
      setup({ done: true })
      expect(screen.queryByLabelText(EDIT_BUTTON)).not.toBeInTheDocument()
    })
    
    it('exits edit mode when enter is pressed', async () => {
      setup()
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
      setup()
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