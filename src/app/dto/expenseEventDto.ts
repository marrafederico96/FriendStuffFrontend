export interface ExpenseEventDto {
    expenseName: string;
    amount: number;
    payerUsername: string;
    eventName: string;
    expenseParticipant?: ExpenseParticipantDto[]
}

export interface ExpenseParticipantDto {
    userName: string;
    eventName?: string;
    amountOwed?: number;
}