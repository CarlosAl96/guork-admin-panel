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
import { Contract } from '../models/contract';
import { NextInvoice } from '../models/nextInvoice';

@Injectable({
  providedIn: 'root',
})
export class ContractsService {
  private contractsUrl: string = `${environment.api_url}contracts`;
  private contractsZipUrl: string = `${environment.api_url}contracts/exportZip`;
  private nextInvoicesUrl: string = `${environment.api_url}contracts/invoices/nexts`;
  private contractsByDatesUrl: string = `${environment.api_url}contracts/between/dates`;
  private contractsAwardsUrl: string = `${environment.api_url}contracts/awards/get`;
  private deleteContractUrl: string = `${environment.api_url}contracts/delete`;
  private downloadUrl: string = `${environment.api_url}download/`;

  constructor(private http: HttpClient) {}

  public getContracts(
    query: QueryPagination
  ): Observable<ApiResponse<ResponsePagination<Contract[]>>> {
    const httpParams = new HttpParams().appendAll({ ...query });
    const options = httpParams
      ? { params: httpParams, header: new HttpHeaders() }
      : { header: new HttpHeaders() };

    return this.http
      .get<ApiResponse<ResponsePagination<Contract[]>>>(
        this.contractsUrl,
        options
      )
      .pipe(catchError(this.handleError));
  }

  public getContractsAwards(
    query: QueryPagination
  ): Observable<ApiResponse<ResponsePagination<Contract[]>>> {
    const httpParams = new HttpParams().appendAll({ ...query });
    const options = httpParams
      ? { params: httpParams, header: new HttpHeaders() }
      : { header: new HttpHeaders() };

    return this.http
      .get<ApiResponse<ResponsePagination<Contract[]>>>(
        this.contractsAwardsUrl,
        options
      )
      .pipe(catchError(this.handleError));
  }

  public downloadContractPdf(url: string): Observable<Blob> {
    const downloadUrl =
      environment.bunny_storage_url +
      'signed-contracts/' +
      url.split('/').pop();

    return this.http.post(
      this.downloadUrl,
      { file: downloadUrl },
      {
        responseType: 'blob',
      }
    );
  }

  public downloadZip(form: FormData): Observable<Blob> {
    return this.http.post(this.contractsZipUrl, form, { responseType: 'blob' });
  }

  public getNextInvoicesByContracts(
    query: QueryPagination
  ): Observable<ApiResponse<ResponsePagination<NextInvoice[]>>> {
    const httpParams = new HttpParams().appendAll({ ...query });
    const options = httpParams
      ? { params: httpParams, header: new HttpHeaders() }
      : { header: new HttpHeaders() };

    return this.http
      .get<ApiResponse<ResponsePagination<NextInvoice[]>>>(
        this.nextInvoicesUrl,
        options
      )
      .pipe(catchError(this.handleError));
  }

  public getContractsBetweenDates(
    from: string,
    to: string,
    code_dealer: number
  ): Observable<ApiResponse<Contract[]>> {
    const httpParams = new HttpParams().appendAll({ from, to, code_dealer });
    const options = httpParams
      ? { params: httpParams, header: new HttpHeaders() }
      : { header: new HttpHeaders() };

    return this.http
      .get<ApiResponse<Contract[]>>(this.contractsByDatesUrl, options)
      .pipe(catchError(this.handleError));
  }

  public deleteContract(id: number, urlContract: string): Observable<any> {
    const query: any = {
      id: id,
      urlContract: urlContract,
    };
    const httpParams = new HttpParams().appendAll({ ...query });
    const options = httpParams
      ? { params: httpParams, header: new HttpHeaders() }
      : { header: new HttpHeaders() };

    return this.http
      .delete<any>(this.deleteContractUrl, options)
      .pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => error || 'Ocurrió un error');
  }
}
