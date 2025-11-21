import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { QueryPagination } from '../models/queryPagination';
import { ApiResponse } from '../models/apiResponse';
import { ResponsePagination } from '../models/responsePagination';
import { Dealer } from '../models/dealer';

@Injectable({
  providedIn: 'root',
})
export class DealersService {
  private dealersUrl: string = `${environment.api_url}dealers`;
  private dealerStoresUrl: string = `${environment.api_url}dealers/store`;
  private dealerUpdateUrl: string = `${environment.api_url}dealers/update/`;
  private dealersGetAll: string = `${environment.api_url}allDealers`;

  constructor(private http: HttpClient) {}

  public getDealers(
    query: QueryPagination
  ): Observable<ApiResponse<ResponsePagination<Dealer[]>>> {
    const httpParams = new HttpParams().appendAll({ ...query });
    const options = httpParams
      ? { params: httpParams, header: new HttpHeaders() }
      : { header: new HttpHeaders() };

    return this.http
      .get<ApiResponse<ResponsePagination<Dealer[]>>>(this.dealersUrl, options)
      .pipe(catchError(this.handleError));
  }

  public getAllDealers(): Observable<ApiResponse<Dealer[]>> {
    return this.http
      .get<ApiResponse<Dealer[]>>(this.dealersGetAll)
      .pipe(catchError(this.handleError));
  }

  createDealer(form: FormData): Observable<any> {
    return this.http
      .post<any>(this.dealerStoresUrl, form)
      .pipe(catchError(this.handleError));
  }

  updateDealer(form: FormData, id: number): Observable<any> {
    return this.http
      .patch<any>(this.dealerUpdateUrl + id, form)
      .pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => error.error.message || 'Ocurrió un error');
  }
}
