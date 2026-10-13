import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Link } from 'react-router-dom'
import { logEntriesForDay, sumMacros } from '../../db/logEntries'
import { DailySummary } from '../summary/DailySummary'
import { DateNav } from './DateNav'
import { LogEntryRow } from './LogEntryRow'

export function DiaryView() {
  const [date, setDate] = useState(() => new Date())

  const entries = useLiveQuery(() => logEntriesForDay(date), [date])

  return (
    <div className="view">
      <DateNav date={date} onChange={setDate} />

      <DailySummary totals={sumMacros(entries ?? [])} />

      <ul className="log-entry-list">
        {entries?.length ? (
          entries.map((entry) => <LogEntryRow key={entry.id} entry={entry} />)
        ) : (
          <li className="empty-state">Nothing logged yet today.</li>
        )}
      </ul>

      <div className="diary-actions">
        <Link className="primary-button" to="/scan">
          Scan barcode
        </Link>
        <Link className="secondary-button" to="/add">
          Add manually
        </Link>
      </div>
    </div>
  )
}
