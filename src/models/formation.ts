export type Formation = {
  id: number
  name: string
  description: string
  image: string
  duration: number
  formation_category?: {
    id: number
    name: string
  }
}
