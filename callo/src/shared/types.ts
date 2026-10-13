export interface Macros {
  kcal: number
  protein: number
  carbs: number
  fat: number
}

export interface Product {
  barcode: string
  name: string
  brand?: string
  imageUrl?: string
  servingSizeGrams?: number
  per100g: Partial<Macros>
  fetchedAt: number
  source: 'off' | 'manual'
}

export interface LogEntry {
  id: number
  timestamp: number
  barcode?: string
  productName: string
  quantityGrams: number
  macros: Macros
  per100gSnapshot?: Partial<Macros>
  healthSynced?: boolean
}
