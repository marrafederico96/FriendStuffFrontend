import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EventDto } from '../dto/eventDto';
import { Observable } from 'rxjs';
import { AddMemberDto, SearchUserDto } from '../dto/userInfoDto';
import { ExpenseDto } from '../dto/expenseDto';

@Injectable({
    providedIn: 'root'
})
export class EventService {
    private http = inject(HttpClient);

    //private readonly url = "https://localhost:7111/api";
    private readonly url = "https://friendstuffbackend.onrender.com/api";

    createEvent(eventData: EventDto): Observable<void> {
        return this.http.post<void>(`${this.url}/event/create`, eventData);
    }

    searchUser(username: SearchUserDto): Observable<SearchUserDto> {
        return this.http.post<SearchUserDto>(`${this.url}/event/search`, username);
    }

    addMember(userToAdd: AddMemberDto): Observable<AddMemberDto> {
        return this.http.post<AddMemberDto>(`${this.url}/event/add`, userToAdd);
    }

    removeMember(userToRemove: AddMemberDto): Observable<void> {
        return this.http.delete<void>(`${this.url}/event/remove`, { body: userToRemove });

    }

    addExpense(expenseData: ExpenseDto): Observable<void> {
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
