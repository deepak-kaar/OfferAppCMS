import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface MapCoordinates {
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root',
})
export class MapUrlCoordinatesService {
  private baseUrl = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) {}

  getCoordinatesFromMapUrl(url: string): Observable<MapCoordinates> {
    const encoded = encodeURIComponent(url);
    return this.http.get<MapCoordinates>(`${this.baseUrl}/vendor/map-url-coordinates?url=${encoded}`);
  }
}
