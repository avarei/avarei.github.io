import type { Product } from '../../shared/types'

interface OffNutriments {
  'energy-kcal_100g'?: number
  proteins_100g?: number
  carbohydrates_100g?: number
  fat_100g?: number
}

interface OffResponse {
  status: number
  product?: {
    product_name?: string
    brands?: string
    serving_size?: string
    image_front_small_url?: string
    nutriments?: OffNutriments
  }
}

function parseServingGrams(servingSize?: string): number | undefined {
  if (!servingSize) return undefined
  const match = servingSize.match(/([\d.]+)\s*g/i)
  return match ? Number(match[1]) : undefined
}

export async function fetchProductFromOff(barcode: string): Promise<Product | null> {
  const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`)
  if (!res.ok) return null

  const data: OffResponse = await res.json()
  if (data.status !== 1 || !data.product) return null

  const n = data.product.nutriments ?? {}

  return {
    barcode,
    name: data.product.product_name || 'Unknown product',
    brand: data.product.brands,
    imageUrl: data.product.image_front_small_url,
    servingSizeGrams: parseServingGrams(data.product.serving_size),
    per100g: {
      kcal: n['energy-kcal_100g'],
      protein: n.proteins_100g,
      carbs: n.carbohydrates_100g,
      fat: n.fat_100g,
    },
    fetchedAt: Date.now(),
    source: 'off',
  }
}
