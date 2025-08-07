import { EventDto } from "./eventDto"

export interface UserInfoDto {
    email?: string,
    userName?: string,
    events?: EventDto[],
}


export interface SearchUserDto {
    username: string,
}

export interface AddMemberDto {
    username: string,
    normalizedEventName: string,
    adminUsername: string
}