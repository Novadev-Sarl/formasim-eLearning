export type Formation = {
  id: number
  name: string
  description: string
  image: string
  duration: number
  formation_category?: FormationCategory
  chapters_count: number
}

export type FormationCategory = {
  id: number
  name: string
}
