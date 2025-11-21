import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token: string | null = sessionStorage.getItem('USER_TOKEN');
  const router: Router = new Router();

  console.log(req.url.toString());

  if (
    token &&
    !req.url.toString().includes('https://ny.storage.bunnycdn.com/')
  ) {
    if (!req.url.toString().includes('refresh')) {
      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token,
        },
      });
    }
  }
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        sessionStorage.clear();
        if (router.url != '/') {
          router.navigate(['']);
        }
      }
      return throwError(() => err.message);
    })
  );
};
