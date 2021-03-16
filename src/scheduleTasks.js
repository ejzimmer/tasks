import { isAfter, isBefore, startOfDay, startOfWeek, sub } from 'date-fns';

const today = () => startOfDay(Date.now())
const yesterday = () => sub(today(), { days: 1 })
const weekStart = () => startOfWeek(Date.now(), {weekStartsOn: 1})
const isWeekend = () => today().getDay() === 6 || today().getDay() === 0

export default function scheduleTasks(initialTasks) {
  return initialTasks
    .filter(task => !!(task.description.trim()))
    .filter(task => task.schedule || !wasTaskDoneYesterday(task)) // remove unscheduled tasks completed before today
    .map(rescheduleTask)
    .sort(sortTasks)
}

const SORT_ORDER = ['DAILY', 'WEEK_DAYS', 'THRICE_WEEKLY', 'TWICE_WEEKLY', 'WEEKLY', '']
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

const shouldResetMutlipleTimesWeeklyTask = (task, numberOfTimes) => {
  if (!task.done) return false

  const numberOfTimesCompletedThisWeek = task.doneAt.filter(date => isAfter(date, weekStart())).length
  if (numberOfTimesCompletedThisWeek < numberOfTimes && wasTaskDoneBeforeYesterday(task)) {
    return true
  }

  return false
}

const shouldResetWeekdayTask = (task) => {
  if (!task.done) return false
  return !isWeekend() && wasTaskDoneYesterday(task)
}

const RESET_TASK = {
  DAILY: wasTaskDoneYesterday,
  WEEK_DAYS: shouldResetWeekdayTask,
  WEEKLY: wasTaskDoneLastWeek,
  TWICE_WEEKLY: task => shouldResetMutlipleTimesWeeklyTask(task, 2),
  THRICE_WEEKLY: task => shouldResetMutlipleTimesWeeklyTask(task, 3)
}

const rescheduleTask = (task) => {
  const shouldResetTask = !!task.schedule && RESET_TASK[task.schedule](task)
  if (shouldResetTask) {
    task.done = false
  }

  return task
}
