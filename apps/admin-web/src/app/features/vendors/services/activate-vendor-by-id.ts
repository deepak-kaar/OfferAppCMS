import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, ObservableInput } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActivateVendorById {
  base_url = ' http://localhost:3000/api/v1';

  constructor(private http: HttpClient) {}

  activateVendor(id: string) {
    return this.http
      .patch(this.base_url + '/vendor/' + `${id}` + '/activate', {})
      .pipe(catchError(handleApiError));
  }
}

function handleApiError(
  err: unknown,
  caught: Observable<object>
): ObservableInput<never> {
  throw err;
}
