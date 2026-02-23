import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, ObservableInput } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EditOffer {
  
  base_url = " http://localhost:3000/api/v1"
  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJIRkJXdGdKZVV5MWw1N1gyaHZQNiIsIm5ldHdvcmtJZCI6Im1hbGlramF4IiwibmFtZSI6ImFkbWluQDEyMyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3MTQxMjYwMywiZXhwIjoxNzcxNDE2MjAzfQ.qxBs2i538aIZPvpLiSljPZL-qF03mZYaMQe_0M840j0"
    
    constructor(private http:HttpClient){
  
    }
  
    editOfferDetailsById(Id:string,payload:any){
      return this.http.put(this.base_url + '/offer/' + `${Id}`,payload).pipe(
        catchError(handleApiError)
      );
  
    }
  
   
  }
  function handleApiError(err: any, caught: Observable<Object>): ObservableInput<any> {
    throw new Error('Function not implemented.');
  }
