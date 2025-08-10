export interface BalanceDto {
    loggedUsername?: string,
}

export interface ResponseBalanceDto {
    balanceAmount: number,
    debtorUsername: string
    payerUsername: string,
}