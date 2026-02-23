import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, ObservableInput } from 'rxjs';
import { CreateVendor } from '../models/createNewVendor';

@Injectable({
  providedIn: 'root',
})
export class DeactiveVendorById {
    base_url = " http://localhost:3000/api/v1"
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJIRkJXdGdKZVV5MWw1N1gyaHZQNiIsIm5ldHdvcmtJZCI6Im1hbGlramF4IiwibmFtZSI6IkFuaWVzIEFoYW1lZCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3MTA3NjYzNiwiZXhwIjoxNzcxMDgwMjM2fQ.X6UWY14oeMcNKyFCy7UAh5o1ZJs6F1tloZQZuGNpWSg"
    
    constructor(private http:HttpClient){
  
    }
  
    deactiveVendor(id:string){
      return this.http.patch(this.base_url + '/vendor/'+`${id}` + '/deactivate',{}).pipe(
        catchError(handleApiError)
      );
  
    }
  
   
  }
  function handleApiError(err: any, caught: Observable<Object>): ObservableInput<any> {
    throw new Error('Function not implemented.');
  }
  

