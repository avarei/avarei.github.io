import { deleteLogEntry, markSynced } from '../../db/logEntries'
import { buildHealthSyncUrl } from '../health-sync/shortcutLink'
import type { LogEntry } from '../../shared/types'

interface LogEntryRowProps {
  entry: LogEntry
}

export function LogEntryRow({ entry }: LogEntryRowProps) {
  function sendToHealth() {
    window.location.href = buildHealthSyncUrl(entry)
    void markSynced(entry.id)
  }

  return (
    <li className="log-entry-row">
      <div className="log-entry-main">
        <span className="log-entry-name">{entry.productName}</span>
        <span className="log-entry-qty">{entry.quantityGrams} g</span>
      </div>
      <div className="log-entry-macros">
        <strong>{Math.round(entry.macros.kcal)} kcal</strong>
        <span>
          P {Math.round(entry.macros.protein)} · C {Math.round(entry.macros.carbs)} · F{' '}
          {Math.round(entry.macros.fat)}
        </span>
      </div>
      <div className="log-entry-actions">
        <button
          className={`icon-button ${entry.healthSynced ? 'synced' : ''}`}
          onClick={sendToHealth}
          title="Send to Apple Health"
        >
          {entry.healthSynced ? '✓ Health' : 'Send to Health'}
        </button>
        <button
          className="icon-button danger"
          onClick={() => deleteLogEntry(entry.id)}
          aria-label="Delete entry"
        >
          ✕
        </button>
      </div>
    </li>
  )
}
