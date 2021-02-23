import { isAfter, isBefore, startOfDay, startOfWeek, sub } from 'date-fns';

const today = () => startOfDay(Date.now())
const yesterday = () => sub(today(), { days: 1 })
const weekStart = () => startOfWeek(Date.now(), {weekStartsOn: 1})

export default function scheduleTasks(initialTasks) {
  return initialTasks
    .filter(task => !!(task.description.trim()))
    .filter(task => task.schedule || !wasTaskDoneYesterday(task)) // remove unscheduled tasks completed before today
    .map(rescheduleTask)
    .sort(sortTasks)
}

const SORT_ORDER = ['DAILY', 'TWICE_WEEKLY', 'WEEKLY', '']
const sortTasks = ({schedule: a = ''}, {schedule: b = ''}) =>  {
  const sortOrderA = SORT_ORDER.findIndex(schedule => schedule === a)
  const sortOrderB = SORT_ORDER.findIndex(schedule => schedule === b)

  return sortOrderA - sortOrderB
}

const mostRecentlyDone = (task) => task.doneAt instanceof Array ? task.doneAt[task.doneAt.length - 1]: task.doneAt
const wasTaskDoneBefore = (task, date) => {
  if (!task.done || !task.doneAt) return false

  const lastDone = mostRecentlyDone(task)
  return isBefore(lastDone, date)
}

const wasTaskDoneYesterday = (task) => wasTaskDoneBefore(task, today())
const wasTaskDoneBeforeYesterday = (task) => wasTaskDoneBefore(task, yesterday())
const wasTaskDoneLastWeek = (task) => wasTaskDoneBefore(task, weekStart())


const shouldResetTwiceWeeklyTask = (task) => {
  if (!task.done) return false

  const numberOfTimesCompletedThisWeek = task.doneAt.filter(date => isAfter(date, weekStart())).length
  if (numberOfTimesCompletedThisWeek < 2 && wasTaskDoneBeforeYesterday(task)) {
    return true
  }

  return false
}

const rescheduleTask = (task) => {
  if (task.schedule === 'DAILY' && wasTaskDoneYesterday(task)) {
    task.done = false
  } else if (task.schedule === 'WEEKLY' && wasTaskDoneLastWeek(task)) {
    task.done = false
  } else if (task.schedule === 'TWICE_WEEKLY' && shouldResetTwiceWeeklyTask(task)) {
    task.done = false
  } 

  return task
}
