import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { catchError, map, Observable, throwError } from "rxjs";
import { QueryPagination } from "../models/queryPagination";
import { User } from "../models/user";
import { ResponsePagination } from "../models/responsePagination";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  private usersUrl: string = `${environment.api_url}users`;

  constructor(private http: HttpClient) {}

  public getUsers(
    query: QueryPagination
  ): Observable<ResponsePagination<User>> {
    const httpParams = new HttpParams().appendAll({ ...query });
    const options = httpParams
      ? { params: httpParams, headers: new HttpHeaders() }
      : { headers: new HttpHeaders() };

    return this.http
      .get<ResponsePagination<User>>(this.usersUrl, options)
      .pipe(catchError(this.handleError));
  }

  public createUser(user: User): Observable<User> {
    return this.http
      .post<User>(this.usersUrl, user)
      .pipe(catchError(this.handleError));
  }

  public updateUser(user: Partial<User>, userId: string): Observable<any> {
    return this.http
      .put<any>(this.usersUrl + "/" + userId, user)
      .pipe(catchError(this.handleError));
  }

  public getUserById(userId: string): Observable<User> {
    return this.http
      .get<User>(this.usersUrl + "/" + userId)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error.error.message || "Ocurrió un error");
  }
}
