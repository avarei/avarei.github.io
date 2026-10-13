import { db } from './schema'
import type { LogEntry, Product } from '../shared/types'

interface ExportBundle {
  exportedAt: string
  products: Product[]
  logEntries: LogEntry[]
}

export async function exportAllData(): Promise<void> {
  const bundle: ExportBundle = {
    exportedAt: new Date().toISOString(),
    products: await db.products.toArray(),
    logEntries: await db.logEntries.toArray(),
  }

  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `callo-export-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export async function importData(file: File): Promise<void> {
  const text = await file.text()
  const bundle: ExportBundle = JSON.parse(text)

  await db.transaction('rw', db.products, db.logEntries, async () => {
    if (bundle.products?.length) {
      await db.products.bulkPut(bundle.products)
    }
    if (bundle.logEntries?.length) {
      await db.logEntries.bulkPut(bundle.logEntries)
    }
  })
}
