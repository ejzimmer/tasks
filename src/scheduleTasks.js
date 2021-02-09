import { isBefore, startOfDay, startOfWeek, sub } from 'date-fns';

const today = () => startOfDay(Date.now())
const weekStart = () => startOfWeek(Date.now())

export default function scheduleTasks(initialTasks) {
  return initialTasks
    .filter(task => !!(task.description.trim()))
    .filter(task => task.schedule || !isTaskDoneYesterday(task))
    .map(rescheduleTask)
    .sort(sortTasks)
}

const SORT_ORDER = ['DAILY', 'TWICE_WEEKLY', 'WEEKLY', '']
const sortTasks = ({schedule: a = ''}, {schedule: b = ''}) =>  {
  const sortOrderA = SORT_ORDER.findIndex(schedule => schedule === a)
  const sortOrderB = SORT_ORDER.findIndex(schedule => schedule === b)

  return sortOrderA - sortOrderB
}

const isTaskDoneYesterday = (task) => task.done && (!task.doneAt || isBefore(task.doneAt, today()))
const isTaskDoneLastWeek = (task) => task.done && (!task.doneAt || isBefore(task.doneAt, weekStart()))
const isTaskLastDoneTwoDaysAgo = (task) => {
  if (!task.done || !task.doneAt || !(task.doneAt instanceof Array)) {
    return false
  }

  const [lastDone] = task.doneAt.sort((a, b) => b - a)
  return isBefore(lastDone, sub(today(), { days: 2 }))
}

const rescheduleTask = (task) => {
  if (task.schedule === 'DAILY' && isTaskDoneYesterday(task)) {
    task.done = false
  } else if (task.schedule === 'WEEKLY' && isTaskDoneLastWeek(task)) {
    task.done = false
  } else if (task.schedule === 'TWICE_WEEKLY' && task.doneAt.length < 2 && isTaskLastDoneTwoDaysAgo(task)) {
    task.done = false
  } 

  return task
}
