import { dateKey } from '../../shared/format'

interface DateNavProps {
  date: Date
  onChange: (date: Date) => void
}

export function DateNav({ date, onChange }: DateNavProps) {
  function shiftDays(delta: number) {
    const next = new Date(date)
    next.setDate(next.getDate() + delta)
    onChange(next)
  }

  const isToday = dateKey(date) === dateKey(new Date())

  return (
    <div className="date-nav">
      <button className="icon-button" onClick={() => shiftDays(-1)} aria-label="Previous day">
        ‹
      </button>

      <input
        type="date"
        value={dateKey(date)}
        onChange={(e) => {
          const [y, m, d] = e.target.value.split('-').map(Number)
          onChange(new Date(y, m - 1, d))
        }}
      />

      {!isToday && (
        <button className="link-button" onClick={() => onChange(new Date())}>
          Today
        </button>
      )}

      <button className="icon-button" onClick={() => shiftDays(1)} aria-label="Next day">
        ›
      </button>
    </div>
  )
}
