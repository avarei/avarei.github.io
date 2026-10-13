import Dexie, { type EntityTable } from 'dexie'
import type { LogEntry, Product } from '../shared/types'

class CalloDB extends Dexie {
  products!: EntityTable<Product, 'barcode'>
  logEntries!: EntityTable<LogEntry, 'id'>

  constructor() {
    super('callo')
    this.version(1).stores({
      products: 'barcode, fetchedAt',
      logEntries: '++id, timestamp, barcode',
    })
  }
}

export const db = new CalloDB()
