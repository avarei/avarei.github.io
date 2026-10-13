import type { Macros } from '../../shared/types'
import { getDailyKcalGoal } from '../settings/settings'

interface DailySummaryProps {
  totals: Macros
}

export function DailySummary({ totals }: DailySummaryProps) {
  const goal = getDailyKcalGoal()
  const pct = goal ? Math.min(100, Math.round((totals.kcal / goal) * 100)) : null

  return (
    <div className="daily-summary">
      <div className="summary-kcal">
        <strong>{Math.round(totals.kcal)}</strong> kcal{goal ? ` / ${goal}` : ''}
      </div>
      {pct != null && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      )}
      <div className="summary-macros">
        <span>Protein {Math.round(totals.protein)}g</span>
        <span>Carbs {Math.round(totals.carbs)}g</span>
        <span>Fat {Math.round(totals.fat)}g</span>
      </div>
    </div>
  )
}
