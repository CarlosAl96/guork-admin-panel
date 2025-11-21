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
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private productsUrl: string = `${environment.api_url}productsWithPg`;
  private createProductUrl: string = `${environment.api_url}products/store`;
  private updateProductUrl: string = `${environment.api_url}products/update/`;
  private deleteProductUrl: string = `${environment.api_url}products/delete`;
  private changeStatusProductUrl: string = `${environment.api_url}products/delete`;
  private updateCategoryValuesUrl: string = `${environment.api_url}products/updateCategoryValues`;

  constructor(private http: HttpClient) {}

  public getProducts(
    query: QueryPagination
  ): Observable<ApiResponse<ResponsePagination<Product[]>>> {
    const httpParams = new HttpParams().appendAll({ ...query });
    const options = httpParams
      ? { params: httpParams, header: new HttpHeaders() }
      : { header: new HttpHeaders() };

    return this.http
      .get<ApiResponse<ResponsePagination<Product[]>>>(
        this.productsUrl,
        options
      )
      .pipe(catchError(this.handleError));
  }

  createProduct(form: FormData): Observable<any> {
    return this.http
      .post<any>(this.createProductUrl, form)
      .pipe(catchError(this.handleError));
  }

  updateProduct(form: FormData, id: number): Observable<any> {
    return this.http
      .patch<any>(this.updateProductUrl + id, form)
      .pipe(catchError(this.handleError));
  }

  updateCategoryValues(request: any): Observable<any> {
    return this.http
      .post<any>(this.updateCategoryValuesUrl, request)
      .pipe(catchError(this.handleError));
  }

  deleteProduct(id: number, url_image: string): Observable<any> {
    const query: any = {
      id: id,
      url_image: url_image,
    };
    const httpParams = new HttpParams().appendAll({ ...query });
    const options = httpParams
      ? { params: httpParams, header: new HttpHeaders() }
      : { header: new HttpHeaders() };

    return this.http
      .delete<any>(this.deleteProductUrl, options)
      .pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => error.error.message || 'Ocurrió un error');
  }
}
