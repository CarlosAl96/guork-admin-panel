import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { QueryPagination } from "../models/queryPagination";
import { ResponsePagination } from "../models/responsePagination";
import { Profile } from "../models/profile";
import { catchError, Observable, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProfilesService {
  private profilesUrl: string = `${environment.api_url}profiles`;

  constructor(private http: HttpClient) {}

  public getProfiles(
    query: QueryPagination
  ): Observable<ResponsePagination<Profile>> {
    const httpParams = new HttpParams().appendAll({ ...query });
    const options = httpParams
      ? { params: httpParams, header: new HttpHeaders() }
      : { header: new HttpHeaders() };

    return this.http
      .get<ResponsePagination<Profile>>(this.profilesUrl, options)
      .pipe(catchError(this.handleError));
  }

  public createProfile(profile: Profile): Observable<Profile> {
    return this.http
      .post<Profile>(this.profilesUrl, profile)
      .pipe(catchError(this.handleError));
  }

  public updateProfile(
    profile: Partial<Profile>,
    profileId: string
  ): Observable<any> {
    return this.http
      .put<any>(this.profilesUrl + "/" + profileId, profile)
      .pipe(catchError(this.handleError));
  }

  public deleteProfile(profileId: string): Observable<boolean> {
    return this.http
      .delete<boolean>(this.profilesUrl + "/" + profileId)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error.error.message || "Ocurrió un error");
  }
}
