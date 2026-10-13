import { db } from './schema'
import { fetchProductFromOff } from '../features/product-lookup/offClient'
import type { Product } from '../shared/types'

const FRESHNESS_WINDOW_MS = 30 * 24 * 60 * 60 * 1000 // 30 days

export async function lookupProduct(barcode: string): Promise<Product | null> {
  const cached = await db.products.get(barcode)
  if (cached && Date.now() - cached.fetchedAt < FRESHNESS_WINDOW_MS) {
    return cached
  }

  const fetched = await fetchProductFromOff(barcode)
  if (fetched) {
    await db.products.put(fetched)
    return fetched
  }

  // Network/lookup failed but we have a (possibly stale) cached copy — better than nothing.
  return cached ?? null
}

export async function saveManualProduct(product: Product): Promise<void> {
  await db.products.put({ ...product, source: 'manual', fetchedAt: Date.now() })
}
