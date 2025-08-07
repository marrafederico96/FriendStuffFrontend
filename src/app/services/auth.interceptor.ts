import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  if (
    req.url.includes('register') ||
    req.url.includes('login') ||
    req.url.includes('refresh')
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
    catchError(err => {
      if (err.status === 401) {
        return authService.refreshToken().pipe(
          switchMap(newTokenDto => {
            if (newTokenDto && newTokenDto.access_token) {
              localStorage.setItem('access_token', newTokenDto.access_token);

              const newReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${newTokenDto.access_token}`),
              });

              return next(newReq);
            }
            return throwError(() => authService.logoutUser());
          }),
          catchError(() => {
            return throwError(() => authService.logoutUser());
          })
        );
      }
      return throwError(() => authService.logoutUser());
    })
  );
};
