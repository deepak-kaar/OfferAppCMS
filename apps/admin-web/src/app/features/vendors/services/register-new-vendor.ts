import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, ObservableInput } from 'rxjs';
import { CreateVendor } from '../models/createNewVendor';

@Injectable({
  providedIn: 'root',
})
export class RegisterNewVendor {
   base_url = " http://localhost:3000/api/v1"
  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJIRkJXdGdKZVV5MWw1N1gyaHZQNiIsIm5ldHdvcmtJZCI6Im1hbGlramF4IiwibmFtZSI6IkFuaWVzIEFoYW1lZCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3MTA3NjYzNiwiZXhwIjoxNzcxMDgwMjM2fQ.X6UWY14oeMcNKyFCy7UAh5o1ZJs6F1tloZQZuGNpWSg"
  
  constructor(private http:HttpClient){

  }


  createVendor(data: CreateVendor) {
    console.log('createVendor service called with data:', data);
    // Build FormData for multipart/form-data request
    const formData = new FormData();

    // Append logo file if present
    if (data.logo && data.logo instanceof File) {
      formData.append('logo', data.logo);
    }

    // Append simple string fields (always send crn_no - required for create)
    if (data.name) formData.append('name', data.name);
    if (data.name_ar) formData.append('name_ar', data.name_ar);
    if (data.description) formData.append('description', data.description);
    if (data.description_ar) formData.append('description_ar', data.description_ar);
    formData.append('crn_no', data.crn_no != null ? String(data.crn_no) : '');
    if (data.smeName) formData.append('smeName', data.smeName);
    if (data.smeEmail) formData.append('smeEmail', data.smeEmail);
    if (data.smePhone) formData.append('smePhone', data.smePhone);
    
    // Append boolean field
    formData.append('isActive', String(data.isActive ?? true));

    // Append arrays - send each item as a separate form field with the same name
    // NestJS will automatically parse these into arrays
    if (data.website && data.website.length > 0) {
      data.website.forEach(item => formData.append('website', item));
    }
    if (data.email && data.email.length > 0) {
      data.email.forEach(item => formData.append('email', item));
    }
    if (data.mobile && data.mobile.length > 0) {
      data.mobile.forEach(item => formData.append('mobile', item));
    }
    if (data.telephone && data.telephone.length > 0) {
      data.telephone.forEach(item => formData.append('telephone', item));
    }
    if (data.links && data.links.length > 0) {
      data.links.forEach(item => formData.append('links', item));
    }
    if (data.locations && data.locations.length > 0) {
      // For complex objects (locations array), send as a single JSON string
      // NestJS will need to parse this, but this is the standard way for nested objects in multipart
      formData.append('locations', JSON.stringify(data.locations));
    }
    if (data.categories && data.categories.length > 0) {
      // Append each category ID as a separate form field with the same name
      // NestJS will automatically parse these into an array
      data.categories.forEach(categoryId => formData.append('categories', categoryId));
    }
    if (data.searchKeywords && data.searchKeywords.length > 0) {
      data.searchKeywords.forEach(item => formData.append('searchKeywords', item));
    }

    // Set headers - Authorization is needed, but Content-Type should be set automatically by browser for FormData
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
      // Do NOT set Content-Type - browser will set it with boundary for multipart/form-data
    });

    console.log('Making HTTP POST request to:', this.base_url + '/vendor');
    console.log('FormData entries:');
    // @ts-ignore
    if (formData && typeof formData.forEach === 'function') {
      // typescript FormData.forEach((value, key) => ...)
      formData.forEach((value: any, key: string) => {
        if (value instanceof File) {
          console.log(key, ':', `File: ${value.name}`);
        } else {
          console.log(key, ':', value);
        }
      });
    }
    
    return this.http.post(this.base_url + '/vendor', formData, { headers }).pipe(
      catchError(handleApiError)
    );
  }

 
}
function handleApiError(err: any, caught: Observable<Object>): ObservableInput<any> {
  throw new Error('Function not implemented.');
}

