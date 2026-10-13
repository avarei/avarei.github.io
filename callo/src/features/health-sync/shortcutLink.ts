import type { LogEntry } from '../../shared/types'
import { getShortcutName } from '../settings/settings'

/**
 * Builds a `shortcuts://` deep link that hands one logged entry to a
 * user-built Shortcut (see README "Apple Health sync" section) via a
 * pipe-delimited payload — simpler for Shortcuts' "Split Text" action to
 * parse than JSON, and avoids comma collisions with food names.
 *
 * Payload: <name>|<kcal>|<protein>|<carbs>|<fat>|<quantityGrams>|<isoTimestamp>
 */
export function buildHealthSyncUrl(entry: LogEntry): string {
  const safeName = entry.productName.replace(/\|/g, '-')
  const fields = [
    safeName,
    entry.macros.kcal,
    entry.macros.protein,
    entry.macros.carbs,
    entry.macros.fat,
    entry.quantityGrams,
    new Date(entry.timestamp).toISOString(),
  ]
  const input = fields.join('|')
  const shortcutName = getShortcutName()
  return `shortcuts://run-shortcut?name=${encodeURIComponent(shortcutName)}&input=${encodeURIComponent(input)}`
}
