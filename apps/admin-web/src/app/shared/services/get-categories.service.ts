import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Category {
  _id: {
    $oid: string;
  };
  name: string;
  name_ar: string;
  icon: string;
  image: string;
  order: number;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class GetCategoriesService {
  base_url = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.base_url + '/category');
  }
}
