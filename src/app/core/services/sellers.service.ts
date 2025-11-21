import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Seller } from '../models/seller';
import { ResponsePagination } from '../models/responsePagination';
import { ApiResponse } from '../models/apiResponse';
import { QueryPagination } from '../models/queryPagination';

@Injectable({
  providedIn: 'root',
})
export class SellersService {
  private sellersUrl: string = `${environment.api_url}sellers`;

  constructor(private http: HttpClient) {}

  public getSellers(
    query: QueryPagination
  ): Observable<ApiResponse<ResponsePagination<Seller[]>>> {
    const httpParams = new HttpParams().appendAll({ ...query });
    const options = httpParams
      ? { params: httpParams, header: new HttpHeaders() }
      : { header: new HttpHeaders() };

    return this.http
      .get<ApiResponse<ResponsePagination<Seller[]>>>(this.sellersUrl, options)
      .pipe(catchError(this.handleError));
  }

  public createSeller(form: FormData): Observable<any> {
    return this.http
      .post<any>(this.sellersUrl, form)
      .pipe(catchError(this.handleError));
  }

  public updateSeller(form: FormData, id: number): Observable<any> {
    return this.http
      .patch<any>(this.sellersUrl + '/' + id, form)
      .pipe(catchError(this.handleError));
  }

  public markAsPayed(id: number): Observable<any> {
    return this.http
      .patch<any>(this.sellersUrl + '/' + id + '/markAsPayed', {})
      .pipe(catchError(this.handleError));
  }

  public getSellersFiltered(
    query: QueryPagination
  ): Observable<ApiResponse<ResponsePagination<Seller[]>>> {
    const httpParams = new HttpParams().appendAll({ ...query });
    const options = httpParams
      ? { params: httpParams, header: new HttpHeaders() }
      : { header: new HttpHeaders() };

    return this.http
      .get<ApiResponse<ResponsePagination<Seller[]>>>(
        this.sellersUrl + 'Filtered',
        options
      )
      .pipe(catchError(this.handleError));
  }

  public markAsPayedFiltered(id: number, month: string): Observable<any> {
    return this.http
      .patch<any>(this.sellersUrl + '/' + id + '/markAsPayedFiltered', {
        month: month,
      })
      .pipe(catchError(this.handleError));
  }

  public handleError(error: HttpErrorResponse) {
    return throwError(() => error.error.message || 'Ocurrió un error');
  }
}
