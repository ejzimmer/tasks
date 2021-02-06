import scheduleTasks from "./scheduleTasks"

const yesterday = Date.now() - 24 * 60 * 60 * 1000
const lastWeek = Date.now() - 7 * 24 * 60 * 60 * 1000

const INITIAL_TASKS = [{
  id: 1,
  description: 'Wash dishes',
  done: true,
  doneAt: yesterday
}, {
  id: 2,
  description: 'Mow lawn',
  done: false
}, {
  id: 4,
  description: 'Brush teeth',
  done: true,
  doneAt: yesterday,
  schedule: 'DAILY'
}, {
  id: 5,
  description: 'Take out bins',
  done: true,
  doneAt: yesterday,
  schedule: 'WEEKLY'
}, {
  id: 6,
  description: 'Clean bathroom',
  done: true,
  doneAt: lastWeek,
  schedule: 'WEEKLY'
}]

describe('scheduleTasks', () => {
  let tasks

  const getTaskByDescription = (description) => tasks.find(task => task.description === description)

  beforeEach(() => {
    tasks = scheduleTasks(INITIAL_TASKS)
  })

  it('removes tasks which were completed yesterday', () => {
    expect(getTaskByDescription('Wash dishes')).toBeFalsy()
  })

  it('re-schedules daily scheduled tasks', () => {
    const brushTeeth = getTaskByDescription('Brush teeth')
    expect(brushTeeth).toBeTruthy()
    expect(brushTeeth.done).toBe(false)
  })

  it('doesn\'t remove completed weekly scheduled tasks', () => {
    const takeOutBins = getTaskByDescription('Take out bins')
    expect(takeOutBins).toBeTruthy()
    expect(takeOutBins.done).toBe(true)
  })

  it('reschedules weekly scheduled tasks', () => {
    const cleanBathroom = getTaskByDescription('Clean bathroom')
    expect(cleanBathroom).toBeTruthy()
    expect(cleanBathroom.done).toBe(false)
  })
})
