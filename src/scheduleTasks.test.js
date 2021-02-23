import { add, sub, startOfWeek, isBefore } from "date-fns"
import scheduleTasks from "./scheduleTasks"

const REAL_TODAY = Date.now()
const FAKE_TODAY = add(startOfWeek(REAL_TODAY, { weekStartsOn: 1 }), { days: 6 })

const daysAgo = (days) => sub(FAKE_TODAY, { days })
const today = FAKE_TODAY
const yesterday = daysAgo(1)
const thisWeek = daysAgo(3)
const lastWeek = daysAgo(8)

const createTask = (config) => ({
  id: Math.round(Math.random() * 10),
  done: false,
  doneAt: [],
  ...config
})

const INITIAL_TASKS = [
  {
    id: 5,
    description: 'Take out bins',
    done: true,
    doneAt: yesterday,
    schedule: 'WEEKLY'
  }, {
    id: 1,
    description: 'Wash dishes',
    done: true,
    doneAt: yesterday
  }, {
    id: 17,
    description: 'Gym',
    done: false,
    schedule: 'TWICE_WEEKLY',
    doneAt: []
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
    id: 6,
    description: 'Clean bathroom',
    done: true,
    doneAt: lastWeek,
    schedule: 'WEEKLY'
  }]

describe('scheduleTasks', () => {
  const getTaskByDescription = (tasks, description) => tasks.find(task => task.description === description)

  beforeEach(() => {
    Date.now = () => FAKE_TODAY
  })

  describe('Unscheduled tasks', () => {
    it('removes tasks which were completed yesterday', () => {
      const tasks = scheduleTasks([
        createTask({ description: 'Wash dishes', done: true, doneAt: yesterday }),
        createTask({ description: 'Mow lawn' })
      ])

      expect(getTaskByDescription(tasks, 'Wash dishes')).toBeFalsy()
    })  
  })

  describe('Daily tasks', () => {
    it('re-schedules daily scheduled tasks done the day before', () => {
      const [brushTeeth, combHair] = scheduleTasks([
        createTask({ description: 'Brush teeth', done: true, doneAt: yesterday, schedule: 'DAILY' }),
        createTask({ description: 'Comb hair', done: true, doneAt: today, schedule: 'DAILY' })
      ])

      expect(brushTeeth.done).toBe(false)
      expect(combHair.done).toBe(true)
    })  
  })

  describe('Weekly tasks', () => {
    const tasks = scheduleTasks([
      createTask({ description: 'Take out bin', done: true, doneAt: thisWeek, schedule: 'WEEKLY' }),
      createTask({ description: 'Clean bathroom', done: true, doneAt: lastWeek, schedule: 'WEEKLY' })
    ])

    it('doesn\'t remove completed weekly scheduled tasks', () => {
      expect(tasks.length).toBe(2)
    })
  
    it('reschedules weekly scheduled tasks completed the previous week', () => {
      const [_, cleanBathroom] = tasks
      expect(cleanBathroom.done).toBe(false)
    })  
  })

  describe('Twice weekly tasks', () => {
    const twoDaysAgo = daysAgo(3)
    const fourDaysAgo = daysAgo(5)

    const createCompletedTask = (doneAt, description = 'Gym') => ({ description, schedule: 'TWICE_WEEKLY', done: true, doneAt })

    it('doesn\'t change a twice weekly task marked as done today or yesterday', () => {
      const [gym, waterPlants] = scheduleTasks([
        createCompletedTask([today]),
        createCompletedTask([yesterday], 'Water plants')
      ])
  
      expect(gym.done).toBe(true)
      expect(waterPlants.done).toBe(true)
    })

    it('changes a twice weekly task to undone if it was done more than two days ago', () => {
      const [gym] = scheduleTasks([createCompletedTask([twoDaysAgo])])
      expect(gym.done).toBe(false)
      expect(gym.doneAt).toEqual([twoDaysAgo])
    })

    it('doesn\'t change a twice weekly task that was marked as done twice this week', () => {
      const [gym] = scheduleTasks([createCompletedTask([twoDaysAgo, fourDaysAgo])])
      expect(gym.done).toBe(true)
    })

    it('doesn\'t change a twice weekly task that was marked as done on Sunday', () => {
      const mondayThisWeek = startOfWeek(FAKE_TODAY, { weekStartsOn: 1 })
      const sundayLastWeek = sub(mondayThisWeek, { days: 1})
      Date.now = () => mondayThisWeek

      const [gym] = scheduleTasks([createCompletedTask([sundayLastWeek])])

      expect(gym.done).toBe(true)
    })

  })

  describe('Sorting', () => {
    it('sorts tasks by daily, twice weekly, weekly, unscheduled', () => {
      const tasks = scheduleTasks(INITIAL_TASKS)
      const sortedTasks = ['Brush teeth', 'Gym', 'Take out bins', 'Clean bathroom', 'Mow lawn']
      expect(tasks.map(task => task.description)).toEqual(sortedTasks)
    })
  })
})
