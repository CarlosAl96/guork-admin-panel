import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { catchError, Observable, throwError } from "rxjs";
import { Invoice } from "../models/invoice";
import { ResponsePagination } from "../models/responsePagination";
import { QueryPagination } from "../models/queryPagination";

@Injectable({
  providedIn: "root",
})
export class InvoicesService {
  private invoiceUrl: string = `${environment.api_url}invoices`;

  constructor(private http: HttpClient) {}

  public getInvoices(
    query: QueryPagination
  ): Observable<ResponsePagination<Invoice>> {
    const httpParams = new HttpParams().appendAll({ ...query });
    const options = httpParams
      ? { params: httpParams, headers: new HttpHeaders() }
      : { headers: new HttpHeaders() };

    return this.http
      .get<ResponsePagination<Invoice>>(this.invoiceUrl, options)
      .pipe(catchError(this.handleError));
  }

  public downloadInvoicePdf(url: string): Observable<Blob> {
    return this.http.post(
      this.invoiceUrl + "/download",
      { file: url },
      {
        responseType: "blob",
      }
    );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error.error.message || "Ocurrió un error");
  }
}
