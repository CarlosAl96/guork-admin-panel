import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { QueryPagination } from "../models/queryPagination";
import { Request } from "../models/request";
import { ResponsePagination } from "../models/responsePagination";
import { Assignment } from "../models/assignment";

@Injectable({
  providedIn: "root",
})
export class RequestsService {
  private requestUrl: string = `${environment.api_url}requests`;
  private assignmentsUrl: string = `${environment.api_url}assignments`;

  constructor(private http: HttpClient) {}

  public getRequests(
    query: QueryPagination
  ): Observable<ResponsePagination<Request>> {
    const httpParams = new HttpParams().appendAll({ ...query });
    const options = httpParams
      ? { params: httpParams, headers: new HttpHeaders() }
      : { headers: new HttpHeaders() };

    return this.http
      .get<ResponsePagination<Request>>(this.requestUrl, options)
      .pipe(catchError(this.handleError));
  }

  public getAssignments(
    query: QueryPagination
  ): Observable<ResponsePagination<Assignment>> {
    const httpParams = new HttpParams().appendAll({ ...query });
    const options = httpParams
      ? { params: httpParams, headers: new HttpHeaders() }
      : { headers: new HttpHeaders() };

    return this.http
      .get<ResponsePagination<Assignment>>(this.assignmentsUrl, options)
      .pipe(catchError(this.handleError));
  }

  public updateAssignment(
    assignmentId: string,
    data: Partial<Assignment>
  ): Observable<Assignment> {
    return this.http
      .put<Assignment>(this.assignmentsUrl + "/" + assignmentId, data)
      .pipe(catchError(this.handleError));
  }

  public updateRequest(
    requestId: string,
    data: Partial<Request>
  ): Observable<Request> {
    return this.http
      .put<Request>(this.requestUrl + "/" + requestId, data)
      .pipe(catchError(this.handleError));
  }

  public deleteRequest(requestId: string): Observable<boolean> {
    return this.http
      .delete<boolean>(this.requestUrl + "/" + requestId)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error.error.message || "Ocurrió un error");
  }
}
