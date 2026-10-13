const SHORTCUT_NAME_KEY = 'callo.healthShortcutName'
const DAILY_GOAL_KEY = 'callo.dailyKcalGoal'

const DEFAULT_SHORTCUT_NAME = 'Log Nutrition'

export function getShortcutName(): string {
  return localStorage.getItem(SHORTCUT_NAME_KEY) || DEFAULT_SHORTCUT_NAME
}

export function setShortcutName(name: string): void {
  localStorage.setItem(SHORTCUT_NAME_KEY, name)
}

export function getDailyKcalGoal(): number | null {
  const raw = localStorage.getItem(DAILY_GOAL_KEY)
  return raw ? Number(raw) : null
}

export function setDailyKcalGoal(goal: number | null): void {
  if (goal == null) {
    localStorage.removeItem(DAILY_GOAL_KEY)
  } else {
    localStorage.setItem(DAILY_GOAL_KEY, String(goal))
  }
}
