export const QUESTION_BANK: Record<string, any>
export const FIRST_QUESTION: string
export function getNextQuestion(questionId: string, answer: any): string | null
export function getQuestionPath(answers: Record<string, any>): string[]
