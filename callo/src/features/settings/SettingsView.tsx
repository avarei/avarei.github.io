import { useRef, useState } from 'react'
import { exportAllData, importData } from '../../db/exportImport'
import { HealthSyncHelp } from '../health-sync/HealthSyncHelp'
import { getDailyKcalGoal, getShortcutName, setDailyKcalGoal, setShortcutName } from './settings'

export function SettingsView() {
  const [shortcutName, setShortcutNameState] = useState(getShortcutName())
  const [goal, setGoal] = useState(() => getDailyKcalGoal()?.toString() ?? '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="view">
      <h2>Settings</h2>

      <label className="field">
        <span>Health shortcut name</span>
        <input
          value={shortcutName}
          onChange={(e) => {
            setShortcutNameState(e.target.value)
            setShortcutName(e.target.value)
          }}
        />
      </label>
      <p className="field-hint">Must exactly match the Shortcut's name in the Shortcuts app.</p>

      <HealthSyncHelp />

      <label className="field">
        <span>Daily calorie goal (optional)</span>
        <input
          type="number"
          inputMode="numeric"
          value={goal}
          placeholder="e.g. 2000"
          onChange={(e) => {
            setGoal(e.target.value)
            setDailyKcalGoal(e.target.value ? Number(e.target.value) : null)
          }}
        />
      </label>

      <div className="settings-data">
        <h3>Your data</h3>
        <p className="field-hint">
          All data lives only on this device. Export regularly as a backup.
        </p>
        <div className="settings-data-actions">
          <button className="secondary-button" onClick={() => void exportAllData()}>
            Export data (JSON)
          </button>
          <button className="secondary-button" onClick={() => fileInputRef.current?.click()}>
            Import data
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void importData(file)
              e.target.value = ''
            }}
          />
        </div>
      </div>
    </div>
  )
}
