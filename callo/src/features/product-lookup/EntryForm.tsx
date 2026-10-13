import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addLogEntry } from '../../db/logEntries'
import { saveManualProduct } from '../../db/productCache'
import { round1 } from '../../shared/format'
import type { Macros, Product } from '../../shared/types'

interface EntryFormProps {
  barcode?: string
  initialName?: string
  initialPer100g?: Partial<Macros>
  initialQuantityGrams?: number
  notice?: string
}

type MacroField = keyof Macros

const MACRO_FIELDS: { key: MacroField; label: string }[] = [
  { key: 'kcal', label: 'Calories (kcal)' },
  { key: 'protein', label: 'Protein (g)' },
  { key: 'carbs', label: 'Carbs (g)' },
  { key: 'fat', label: 'Fat (g)' },
]

export function EntryForm({
  barcode,
  initialName = '',
  initialPer100g = {},
  initialQuantityGrams = 100,
  notice,
}: EntryFormProps) {
  const navigate = useNavigate()
  const [name, setName] = useState(initialName)
  const [quantity, setQuantity] = useState(String(initialQuantityGrams))
  const [per100g, setPer100g] = useState<Record<MacroField, string>>({
    kcal: initialPer100g.kcal != null ? String(initialPer100g.kcal) : '',
    protein: initialPer100g.protein != null ? String(initialPer100g.protein) : '',
    carbs: initialPer100g.carbs != null ? String(initialPer100g.carbs) : '',
    fat: initialPer100g.fat != null ? String(initialPer100g.fat) : '',
  })
  const [saving, setSaving] = useState(false)

  const quantityGrams = Number(quantity) || 0

  const computed = useMemo<Macros>(() => {
    const factor = quantityGrams / 100
    return {
      kcal: round1((Number(per100g.kcal) || 0) * factor),
      protein: round1((Number(per100g.protein) || 0) * factor),
      carbs: round1((Number(per100g.carbs) || 0) * factor),
      fat: round1((Number(per100g.fat) || 0) * factor),
    }
  }, [per100g, quantityGrams])

  async function handleSave() {
    if (!name.trim() || quantityGrams <= 0) return
    setSaving(true)

    const per100gSnapshot: Partial<Macros> = {
      kcal: per100g.kcal === '' ? undefined : Number(per100g.kcal),
      protein: per100g.protein === '' ? undefined : Number(per100g.protein),
      carbs: per100g.carbs === '' ? undefined : Number(per100g.carbs),
      fat: per100g.fat === '' ? undefined : Number(per100g.fat),
    }

    if (barcode) {
      const product: Product = {
        barcode,
        name: name.trim(),
        per100g: per100gSnapshot,
        fetchedAt: Date.now(),
        source: 'manual',
      }
      await saveManualProduct(product)
    }

    await addLogEntry({
      timestamp: Date.now(),
      barcode,
      productName: name.trim(),
      quantityGrams,
      macros: computed,
      per100gSnapshot,
    })

    navigate('/')
  }

  return (
    <div className="entry-form">
      {notice && <p className="notice">{notice}</p>}

      <label className="field">
        <span>Product name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Peanut Butter" />
      </label>

      <label className="field">
        <span>Quantity consumed (g)</span>
        <input
          type="number"
          inputMode="decimal"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </label>

      <fieldset className="macro-fields">
        <legend>Per 100 g</legend>
        {MACRO_FIELDS.map(({ key, label }) => (
          <label className="field" key={key}>
            <span>{label}</span>
            <input
              type="number"
              inputMode="decimal"
              value={per100g[key]}
              placeholder="—"
              onChange={(e) => setPer100g((prev) => ({ ...prev, [key]: e.target.value }))}
            />
          </label>
        ))}
      </fieldset>

      <div className="computed-preview">
        <strong>{computed.kcal} kcal</strong> for {quantityGrams || 0} g
        <div className="macro-chips">
          <span>P {computed.protein}g</span>
          <span>C {computed.carbs}g</span>
          <span>F {computed.fat}g</span>
        </div>
      </div>

      <button
        className="primary-button"
        disabled={saving || !name.trim() || quantityGrams <= 0}
        onClick={handleSave}
      >
        {saving ? 'Saving…' : 'Log it'}
      </button>
    </div>
  )
}
