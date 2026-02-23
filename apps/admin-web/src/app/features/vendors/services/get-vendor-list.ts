import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, ObservableInput } from 'rxjs';
import { normalizeVendorResponse } from '../models/vendordetails';
import { VendorDetails } from '../models/vendordetails';

@Injectable({
  providedIn: 'root',
})
export class GetVendorList {
   base_url = " http://localhost:3000/api/v1"
  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJIRkJXdGdKZVV5MWw1N1gyaHZQNiIsIm5ldHdvcmtJZCI6Im1hbGlramF4IiwibmFtZSI6IkFuaWVzIEFoYW1lZCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3MTA3NjYzNiwiZXhwIjoxNzcxMDgwMjM2fQ.X6UWY14oeMcNKyFCy7UAh5o1ZJs6F1tloZQZuGNpWSg"
  
  constructor(private http:HttpClient){

  }

   getAllVendors(): Observable<VendorDetails[]> {
      return this.http.get<VendorDetails[]>(this.base_url + '/vendor').pipe(
        map((list) => (Array.isArray(list) ? list.map(normalizeVendorResponse) : [])),
        catchError(handleApiError)
      );
    }
  
}

function handleApiError(err: any, caught: Observable<Object>): ObservableInput<any> {
  throw new Error('Function not implemented.');
}
