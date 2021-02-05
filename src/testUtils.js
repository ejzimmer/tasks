import { screen, fireEvent, act } from '@testing-library/react'

export function createCard(description = 'Buy milk', schedule) {
  const input = screen.getByTestId('new-task')
  act(() => {
    fireEvent.change(input, { target: { value: description }})
  })

  if (schedule) {
    const scheduleOption = screen.getByLabelText(schedule)
    fireEvent.click(scheduleOption)  
  }

  act(() => {
    fireEvent.keyDown(input, { 
      key: 'Enter',
      shiftKey: false,
    })
  })
}
