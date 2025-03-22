export type Formation = {
  id: number
  name: string
  description: string
  image: string
  duration: number
  certificate?: {
    name: string
    date: string
    duration: number
  }
  formation_category?: FormationCategory
  chapters_count: number
}

export type DetailedFormation = Omit<Formation, 'chapters_count'> & {
  chapters: FormationChapter[]
  formation_user: FormationUser
}

export type FormationUser = {
  formation_id: number
  user_id: number
  current_question: number
  spent_time: number
  completed_chapters: number[]
  formation?: Formation
  created_at: string
  completed_at: string | null
}

export type FormationCategory = {
  id: number
  name: string
}

export type FormationChapter = {
  id: number
  formation_id: number
  position: number
  name: string
  created_at: string
  updated_at: string
}

export type FormationQuestion = {
  id: number
  question: string
  options?: string[]
  type: 'true_false' | 'select' | 'open'
  formation_chapter: FormationChapter
}
