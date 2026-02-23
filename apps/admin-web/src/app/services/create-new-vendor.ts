import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, ObservableInput } from 'rxjs';
import { CreateVendor } from '../features/vendors/models/createNewVendor'; 
@Injectable({
  providedIn: 'root',
})
export class CreateNewVendor {
  base_url = " http://localhost:3000/api/v1"
  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJMODNvZW11Mks0M2NkU2pSS3lKWiIsIm5ldHdvcmtJZCI6Imlua29sbGR4IiwibmFtZSI6IkRlZXBhayIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3MDgwNjg2NywiZXhwIjoxNzcwODEwNDY3fQ.yrHez5SnoKxeIQqZghqybFtnTjMfHcJKncr-qn-NNN0"
  
  constructor(private http:HttpClient){

  }


  createVendor(data:CreateVendor){
    return this.http.post(this.base_url + '/vendor',data).pipe(
      catchError(handleApiError)
    );

  }

  getAllVendors(){
    return this.http.get(this.base_url + '/vendor').pipe(
      catchError(handleApiError)
    )
  }
}
function handleApiError(err: any, caught: Observable<Object>): ObservableInput<any> {
  throw new Error('Function not implemented.');
}

