export interface ExpenseDto {
    expenseName: string,
    amount: number,
    eventName: string,
    payerUsername: string,
    expenseParticipant?: []
}