export interface EventDto {
    eventName: string,
    normalizedEventName?: string,
    startDate: string,
    endDate: string,
    adminEmail: string,
    participants?: Participants[]
}

export interface Participants {
    userName: string,
    role: number
}