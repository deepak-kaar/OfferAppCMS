import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, ObservableInput } from 'rxjs';
import { CreateVendor } from '../models/createNewVendor';

@Injectable({
  providedIn: 'root',
})
export class UpdateVendorDetails {
  base_url = ' http://localhost:3000/api/v1';
  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJIRkJXdGdKZVV5MWw1N1gyaHZQNiIsIm5ldHdvcmtJZCI6Im1hbGlramF4IiwibmFtZSI6IkFuaWVzIEFoYW1lZCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3MTA3NjYzNiwiZXhwIjoxNzcxMDgwMjM2fQ.X6UWY14oeMcNKyFCy7UAh5o1ZJs6F1tloZQZuGNpWSg"

  constructor(private http: HttpClient) {}

  saveVendor(data: CreateVendor, id: string): Observable<object> {
    const hasLogoFile = data.logo != null && data.logo instanceof File;
    if (hasLogoFile) {
      const formData = this.buildUpdateFormData(data);
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
      });
      return this.http
        .put(this.base_url + '/vendor/' + id, formData, { headers })
        .pipe(catchError(handleApiError));
    }
    const { logo: _logo, ...jsonPayload } = data as CreateVendor & { logo?: File | string | null };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    });
    return this.http
      .put(this.base_url + '/vendor/' + id, jsonPayload, { headers })
      .pipe(catchError(handleApiError));
  }

  private buildUpdateFormData(data: CreateVendor): FormData {
    const formData = new FormData();
    formData.append('logo', data.logo as File);

    if (data.name) formData.append('name', data.name);
    if (data.name_ar) formData.append('name_ar', data.name_ar);
    if (data.description) formData.append('description', data.description ?? '');
    if (data.description_ar) formData.append('description_ar', data.description_ar ?? '');
    formData.append('crn_no', data.crn_no != null ? String(data.crn_no) : '');
    if (data.smeName) formData.append('smeName', data.smeName);
    if (data.smeEmail) formData.append('smeEmail', data.smeEmail);
    if (data.smePhone) formData.append('smePhone', data.smePhone);
    formData.append('isActive', String(data.isActive ?? true));

    if (data.website?.length) data.website.forEach((item) => formData.append('website', item));
    if (data.email?.length) data.email.forEach((item) => formData.append('email', item));
    if (data.mobile?.length) data.mobile.forEach((item) => formData.append('mobile', item));
    if (data.telephone?.length) data.telephone.forEach((item) => formData.append('telephone', item));
    if (data.links?.length) data.links.forEach((item) => formData.append('links', item));
    if (data.locations?.length) formData.append('locations', JSON.stringify(data.locations));
    if (data.categories?.length) data.categories.forEach((id) => formData.append('categories', id));
    if (data.searchKeywords?.length) data.searchKeywords.forEach((item) => formData.append('searchKeywords', item));

    return formData;
  }
}

function handleApiError(err: unknown, caught: Observable<object>): ObservableInput<never> {
  throw err;
}


  

