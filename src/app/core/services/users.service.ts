import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { QueryPagination } from '../models/queryPagination';
import { User } from '../models/user';
import { ApiResponse } from '../models/apiResponse';
import { ResponsePagination } from '../models/responsePagination';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private usersUrl: string = `${environment.api_url}users`;
  private usersUpdateUrl: string = `${environment.api_url}users/update/`;
  private usersCsvUrl: string = `${environment.api_url}usersToCsv`;

  constructor(private http: HttpClient) {}

  public getUsers(
    query: QueryPagination
  ): Observable<ApiResponse<ResponsePagination<User[]>>> {
    const httpParams = new HttpParams().appendAll({ ...query });
    const options = httpParams
      ? { params: httpParams, header: new HttpHeaders() }
      : { header: new HttpHeaders() };

    return this.http
      .get<ApiResponse<ResponsePagination<User[]>>>(this.usersUrl, options)
      .pipe(catchError(this.handleError));
  }

  updateUser(form: FormData, id: number): Observable<any> {
    return this.http
      .put<any>(this.usersUpdateUrl + id, form)
      .pipe(catchError(this.handleError));
  }

  public getUserById(userId: number): Observable<ApiResponse<User>> {
    return this.http
      .get<ApiResponse<User>>(this.usersUrl + '/' + userId)
      .pipe(catchError(this.handleError));
  }

  exportCsv(code_dealer: number): Observable<Blob> {
    const httpParams = new HttpParams().appendAll({ code_dealer });
    const options = httpParams
      ? { params: httpParams, header: new HttpHeaders() }
      : { header: new HttpHeaders() };

    return this.http.get(this.usersCsvUrl, {
      ...options,
      responseType: 'blob',
    });
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => error.error.message || 'Ocurrió un error');
  }
}
