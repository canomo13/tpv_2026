import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BusinessSettings {
  id?: string;
  name: string;
  companyName?: string;
  cif?: string;
  address?: string;
  phone?: string;
  logoSvg?: string;
  socialMediaUrl?: string;
  footerMessage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiUrl = 'http://localhost:3000/api/settings';

  constructor(private http: HttpClient) {}

  getSettings(): Observable<BusinessSettings> {
    return this.http.get<BusinessSettings>(this.apiUrl);
  }

  updateSettings(settings: BusinessSettings): Observable<BusinessSettings> {
    return this.http.put<BusinessSettings>(this.apiUrl, settings);
  }
}
