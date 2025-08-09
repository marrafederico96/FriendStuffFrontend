import { ExpenseEventDto } from "./expenseEventDto"

export interface EventDto {
    eventName: string,
    normalizedEventName?: string,
    startDate: string,
    endDate: string,
    adminEmail: string,
    participants?: EventUserDto[],
    expensesEvent?: ExpenseEventDto[]
}

export interface EventUserDto {
    userName: string,
    role: number
}