import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, map, Observable, throwError } from "rxjs";
import { AuthResponse } from "../models/authResponse";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private loginUrl: string = `${environment.api_url}auth/login`;

  constructor(private http: HttpClient) {}

  public login(request: any): Observable<AuthResponse> {
    request.app = "web";

    return this.http.post<AuthResponse>(this.loginUrl, request).pipe(
      map((res) => res),
      catchError(this.handleError)
    );
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => error.error.message || "Ocurrió un error");
  }
}
