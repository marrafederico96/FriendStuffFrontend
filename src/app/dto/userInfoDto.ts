import { EventDto } from "./eventDto"

export interface UserInfoDto {
    email?: string,
    userName?: string,
    events?: EventDto[],
}


export interface UserNameDto {
    username: string,
}

export interface EventMemberDto {
    username: string,
    normalizedEventName: string,
    adminUsername: string
}