export interface EventDto {
    eventName: string,
    normalizedEventName: string,
    startDate: Date,
    endDate: Date,
    adminEmail: string,
    participants: Participants[]
}

export interface Participants {
    userName: string,
    role: number
}