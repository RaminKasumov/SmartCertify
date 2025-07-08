import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private toastr: ToastrService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 500 && error.error) {
          this.handleServerError(error.error);
        }
        return throwError(() => error);
      })
    );
  }

  private handleServerError(error: any): void {
    const requestId = error.requestId ? ` Request ID: ${error.requestId}` : '';
    this.toastr.error(
      `${error.message} ${requestId}`,
      'Server Error - It is on our side',
      {
        timeOut: 0, // Keep open until user closes
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-top-full-width',
      }
    );
  }
}
