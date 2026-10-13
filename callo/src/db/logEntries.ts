import { db } from './schema'
import { startOfDay, endOfDay } from '../shared/format'
import type { LogEntry, Macros } from '../shared/types'

export function logEntriesForDay(date: Date) {
  return db.logEntries
    .where('timestamp')
    .between(startOfDay(date), endOfDay(date), true, true)
    .reverse()
    .sortBy('timestamp')
}

export async function addLogEntry(entry: Omit<LogEntry, 'id'>): Promise<number> {
  return db.logEntries.add(entry as LogEntry)
}

export async function deleteLogEntry(id: number): Promise<void> {
  await db.logEntries.delete(id)
}

export async function markSynced(id: number): Promise<void> {
  await db.logEntries.update(id, { healthSynced: true })
}

export function sumMacros(entries: LogEntry[]): Macros {
  return entries.reduce(
    (totals, entry) => ({
      kcal: totals.kcal + entry.macros.kcal,
      protein: totals.protein + entry.macros.protein,
      carbs: totals.carbs + entry.macros.carbs,
      fat: totals.fat + entry.macros.fat,
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 },
  )
}
