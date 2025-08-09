import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, of } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { TokenDto } from '../dto/tokenDto';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (
    req.url.includes('register') ||
    req.url.includes('login') ||
    req.url.includes('refresh') ||
    req.url.includes('logout')
  ) {
    return next(req);
  }

  const token = localStorage.getItem('access_token');
  let reqWithJwt = req;
  if (token) {
    reqWithJwt = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
  }

  return next(reqWithJwt).pipe(
    catchError((err) => {
      if (err.status === 401) {
        return authService.refreshToken().pipe(
          switchMap((newToken: TokenDto) => {
            localStorage.setItem('access_token', newToken.access_token);
            const newReq = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${newToken.access_token}`),
            });
            return next(newReq);
          }),
          catchError(() => {
            return authService.logoutUser().pipe(
              switchMap(() => {
                localStorage.removeItem('access_token');
                authService.userInfo.set(null);
                window.location.reload();
                return throwError(() => err);
              })
            );
          })
        );
      }
      return throwError(() => err);
    })
  );
};
