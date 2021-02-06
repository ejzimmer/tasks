import scheduleTasks from "./scheduleTasks"

const daysAgo = (days) => Date.now() - days * 24 * 60 * 60 * 1000

const today = Date.now()
const yesterday = daysAgo(1)
const lastWeek = daysAgo(7)

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

  describe('Unscheduled tasks', () => {
    it('removes tasks which were completed yesterday', () => {
      const tasks = scheduleTasks(INITIAL_TASKS)
      expect(getTaskByDescription(tasks, 'Wash dishes')).toBeFalsy()
    })  
  })

  describe('Daily tasks', () => {
    it('re-schedules daily scheduled tasks', () => {
      const tasks = scheduleTasks(INITIAL_TASKS)

      const brushTeeth = getTaskByDescription(tasks, 'Brush teeth')
      expect(brushTeeth).toBeTruthy()
      expect(brushTeeth.done).toBe(false)
    })  
  })

  describe('Weekly tasks', () => {
    let tasks 

    beforeEach(() => {
      tasks = scheduleTasks(INITIAL_TASKS)
    })

    it('doesn\'t remove completed weekly scheduled tasks', () => {
      const takeOutBins = getTaskByDescription(tasks, 'Take out bins')
      expect(takeOutBins).toBeTruthy()
      expect(takeOutBins.done).toBe(true)
    })
  
    it('reschedules weekly scheduled tasks', () => {
      const cleanBathroom = getTaskByDescription(tasks, 'Clean bathroom')
      expect(cleanBathroom).toBeTruthy()
      expect(cleanBathroom.done).toBe(false)
    })  
  })

  describe('Twice weekly tasks', () => {
    const twoDaysAgo = daysAgo(3)
    const fourDaysAgo = daysAgo(5)

    it('doesn\'t change a twice weekly task marked as done today or yesterday', () => {
      const tasks = scheduleTasks([
        {
          id: 17,
          description: 'Gym',
          schedule: 'TWICE_WEEKLY',
          done: true,
          doneAt: [today]
        }, {
          id: 18,
          description: 'Water plants',
          schedule: 'TWICE_WEEKLY',
          done: true,
          doneAt: [yesterday]
        }
      ])

      const tasksDone = tasks.map(task => task.done)
      expect(tasksDone).toEqual([true, true])
    })

    it('changes a twice weekly task to undone if it was done more than two days ago', () => {

      const [gym] = scheduleTasks([
        {
          id: 17,
          description: 'Gym',
          schedule: 'TWICE_WEEKLY',
          done: true,
          doneAt: [twoDaysAgo]
        }
      ])

      expect(gym.done).toBe(false)
      
    })

    it('doesn\'t change a twice weekly task that was marked as done twice this week', () => {
      const [gym] = scheduleTasks([
        {
          id: 17,
          description: 'Gym',
          schedule: 'TWICE_WEEKLY',
          done: true,
          doneAt: [twoDaysAgo, fourDaysAgo]
        }
      ])

      expect(gym.done).toBe(true)
    })

    it('reschedules a done task at the start of the week', () => {

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
