export interface QuestionOption {
  value: string
  label: string
  sub?: string
  icon?: string
}

export interface QuestionDef {
  id: string
  question: string
  sub?: string
  type: 'single' | 'multi'
  options: QuestionOption[]
  next: (answer: string | string[]) => string | null
}

export interface QuestionBank {
  [id: string]: QuestionDef
}

export const QUESTION_BANK: QuestionBank
export const FIRST_QUESTION: string
export function getNextQuestion(questionId: string, answer: string | string[]): string | null
export function getQuestionPath(answers: Record<string, string | string[]>): string[]
