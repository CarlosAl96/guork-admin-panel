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
import { Invoice } from '../models/invoice';

@Injectable({
  providedIn: 'root',
})
export class InvoicesService {
  private invoicesUrl: string = `${environment.api_url}invoices`;
  private verifyUrl: string = `${environment.api_url}invoices/verifyPayment/`;

  constructor(private http: HttpClient) {}

  public getInvoices(
    query: QueryPagination
  ): Observable<ApiResponse<ResponsePagination<Invoice[]>>> {
    const httpParams = new HttpParams().appendAll({ ...query });
    const options = httpParams
      ? { params: httpParams, header: new HttpHeaders() }
      : { header: new HttpHeaders() };

    return this.http
      .get<ApiResponse<ResponsePagination<Invoice[]>>>(
        this.invoicesUrl,
        options
      )
      .pipe(catchError(this.handleError));
  }

  public verifyPayment(id: number): Observable<any> {
    return this.http
      .patch<any>(this.verifyUrl + id, {})
      .pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => error.error.message || 'Ocurrió un error');
  }
}
