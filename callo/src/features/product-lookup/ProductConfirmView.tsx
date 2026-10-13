import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { lookupProduct } from '../../db/productCache'
import type { Product } from '../../shared/types'
import { EntryForm } from './EntryForm'

export function ProductConfirmView() {
  const { barcode = '' } = useParams()
  const [status, setStatus] = useState<'loading' | 'found' | 'not-found'>('loading')
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    lookupProduct(barcode).then((result) => {
      if (cancelled) return
      setProduct(result)
      setStatus(result ? 'found' : 'not-found')
    })
    return () => {
      cancelled = true
    }
  }, [barcode])

  if (status === 'loading') {
    return (
      <div className="view-centered">
        <p>Looking up barcode {barcode}…</p>
      </div>
    )
  }

  return (
    <div className="view">
      <h2>{status === 'found' ? 'Confirm product' : 'Product not found'}</h2>
      <EntryForm
        barcode={barcode}
        initialName={product?.name}
        initialPer100g={product?.per100g}
        notice={
          status === 'not-found'
            ? `No match for barcode ${barcode} in Open Food Facts. Enter it manually — it'll be remembered next time you scan it.`
            : undefined
        }
      />
    </div>
  )
}
