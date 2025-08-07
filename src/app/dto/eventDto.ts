import { ExpenseDto } from "./expenseDto"

export interface EventDto {
    eventName: string,
    normalizedEventName?: string,
    startDate: string,
    endDate: string,
    adminEmail: string,
    participants?: Participants[],
    expensesEvent?: ExpenseDto[]
}

export interface Participants {
    userName: string,
    role: number
}