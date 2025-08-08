export interface ExpenseDto {
    expenseName: string,
    amount: number,
    eventName: string,
    payerUsername: string,
    expenseParticipant?: ExpenseParticipantDto[]
}

export interface ExpenseParticipantDto {
    userName: string;
    eventName?: string;
}