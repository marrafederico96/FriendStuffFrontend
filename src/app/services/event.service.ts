import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EventDto } from '../dto/eventDto';
import { Observable } from 'rxjs';
import { EventMemberDto, UserNameDto } from '../dto/userInfoDto';
import { environment } from '../../environments/environment';
import { ExpenseEventDto, ExpenseRefundDto } from '../dto/expenseEventDto';
import { BalanceDto, ResponseBalanceDto } from '../dto/balanceDto';

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

    addRefund(refundData: ExpenseRefundDto): Observable<void> {
        return this.http.post<void>(`${this.url}/expenserefund/add`, refundData);
    }

    getBalances(balanceData: BalanceDto): Observable<ResponseBalanceDto[]> {
        return this.http.post<ResponseBalanceDto[]>(`${this.url}/expense/balance`, balanceData);
    }

    getRole(role: number): string {
        if (role == 0) {
            return "Admin"
        } else {
            return "Member"
        }
    }
}
