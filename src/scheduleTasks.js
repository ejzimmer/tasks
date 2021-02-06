import { isBefore, startOfDay, startOfWeek } from 'date-fns';

const today = () => startOfDay(Date.now())
const weekStart = () => startOfWeek(Date.now())

export default function scheduleTasks(initialTasks) {
  return initialTasks
    .filter(task => !!(task.description.trim()))
    .filter(task => task.schedule || !isTaskDoneYesterday(task))
    .map(rescheduleTask)
    .sort(sortTasks)
}

const sortTasks = ({schedule: a = ''}, {schedule: b = ''}) =>  {
  if (a === b) return 0
  if (a === 'DAILY') return -1
  if (b === 'DAILY') return 1
  if (a === 'WEEKLY') return -1
  return 1
}

const isTaskDoneYesterday = (task) => task.done && (!task.doneAt || isBefore(task.doneAt, today()))
const isTaskDoneLastWeek = (task) => task.done && (!task.doneAt || isBefore(task.doneAt, weekStart()))
const rescheduleTask = (task) => {
  if (task.schedule === 'DAILY' && isTaskDoneYesterday(task)) {
    task.done = false
  } else if (task.schedule === 'WEEKLY' && isTaskDoneLastWeek(task)) {
    task.done = false
  }

  return task
}
