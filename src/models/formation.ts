export type Formation = {
  id: number
  name: string
  description: string
  image: string
  duration: number
  formation_category?: FormationCategory
  chapters_count: number
}

export type DetailedFormation = Omit<Formation, 'chapters_count'> & {
  chapters: FormationChapter[]
  formation_user: FormationUser
}

export type FormationUser = {
  current_question: number
  spent_time: number
  completed_chapters: number[]
}

export type FormationCategory = {
  id: number
  name: string
}

export type FormationChapter = {
  id: number
  name: string
}