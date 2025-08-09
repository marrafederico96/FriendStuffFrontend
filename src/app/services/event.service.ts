import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EventDto } from '../dto/eventDto';
import { Observable } from 'rxjs';
import { EventMemberDto, UserNameDto } from '../dto/userInfoDto';
import { environment } from '../../environments/environment';
import { ExpenseEventDto } from '../dto/expenseEventDto';

@Injectable({
    providedIn: 'root'
})
export class EventService {
    private http = inject(HttpClient);

    private readonly url = environment.url;

    createEvent(eventData: EventDto): Observable<void> {
        return this.http.post<void>(`${this.url}/event/create`, eventData);
    }

    searchUser(username: UserNameDto): Observable<UserNameDto> {
        return this.http.post<UserNameDto>(`${this.url}/event/search`, username);
    }

    addMember(userToAdd: EventMemberDto): Observable<EventMemberDto> {
        return this.http.post<EventMemberDto>(`${this.url}/event/add`, userToAdd);
    }

    removeMember(userToRemove: EventMemberDto): Observable<void> {
        return this.http.delete<void>(`${this.url}/event/remove`, { body: userToRemove });

    }

    addExpense(expenseData: ExpenseEventDto): Observable<void> {
        return this.http.post<void>(`${this.url}/expense/add`, expenseData);
    }

    getRole(role: number): string {
        if (role == 0) {
            return "Admin"
        } else {
            return "Member"
        }
    }
}
