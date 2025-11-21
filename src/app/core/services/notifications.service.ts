import { Injectable } from '@angular/core';
import { PushNotification } from '../models/notification';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { ApiResponse } from '../models/apiResponse';
import { catchError, Observable, throwError } from 'rxjs';
import { ResponsePagination } from '../models/responsePagination';
import { QueryPagination } from '../models/queryPagination';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private notificationsUrl: string = `${environment.api_url}notifications`;

  constructor(private http: HttpClient) {}

  public getNotificationsList(
    query: QueryPagination
  ): Observable<ApiResponse<ResponsePagination<PushNotification[]>>> {
    const httpParams = new HttpParams().appendAll({ ...query });
    const options = httpParams
      ? { params: httpParams, header: new HttpHeaders() }
      : { header: new HttpHeaders() };

    return this.http
      .get<ApiResponse<ResponsePagination<PushNotification[]>>>(
        this.notificationsUrl,
        options
      )
      .pipe(catchError(this.handleError));
  }

  public sendNotification(notification: PushNotification): Observable<any> {
    return this.http
      .post<any>(this.notificationsUrl, notification)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error.error.message || 'Ocurrió un error');
  }
}
