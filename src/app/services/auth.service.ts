import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TokenDto } from '../dto/tokenDto';
import { UserInfoDto } from '../dto/userInfoDto';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { LoginDto, RegisterDto } from '../dto/authDto';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  public readonly userInfo = signal<UserInfoDto | null>(null);
  public readonly userEvents = computed(() => this.userInfo()?.events ?? []);
  public readonly loading = signal<boolean>(true);

  //private readonly url = "https://friendstuffbackend.onrender.com/api";
  private readonly url = environment.url;


  registerUser(registerData: RegisterDto): Observable<void> {
    return this.http.post<void>(`${this.url}/account/register`, registerData);
  }

  loginUser(loginData: LoginDto): Observable<TokenDto> {
    return this.http.post<TokenDto>(`${this.url}/account/login`, loginData, { withCredentials: true }).pipe(
      tap(token => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('access_token', token.access_token);
          this.loadUserInfo();
        }
      })
    );
  }

  logoutUser() {
    localStorage.removeItem('access_token');
    this.userInfo.set(null);
    window.location.reload();
  }

  refreshToken(): Observable<TokenDto> {
    return this.http.post<TokenDto>(`${this.url}/account/refresh`, {}, { withCredentials: true });
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem("access_token");
    }
    return false;
  }

  loadUserInfo(): void {
    if (isPlatformBrowser(this.platformId) && this.isLoggedIn()) {
      this.http.get<UserInfoDto>(`${this.url}/account/getuser`, { withCredentials: true }).subscribe({
        next: (user) => {
          this.userInfo.set(user)
          this.loading.set(false);
        },
        error: () => {
          this.userInfo.set(null);
          this.loading.set(false);
        },
      });
    } else if (isPlatformBrowser(this.platformId)) {
      this.loading.set(false);
    }
  }
}
