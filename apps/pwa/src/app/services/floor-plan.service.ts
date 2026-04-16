import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';

export interface Zone {
  id: string;
  name: string;
  tables?: HandheldTable[];
}

export interface HandheldTable {
  id: string;
  number: number;
  status: 'free' | 'occupied' | 'dirty';
  zoneId: string;
  x?: number;
  y?: number;
  shape?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FloorPlanService {
  private apiUrl = 'http://localhost:3000/api/floor-plan';
  
  private tablesSubject = new BehaviorSubject<HandheldTable[]>([]);
  tables$ = this.tablesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getZones(): Observable<Zone[]> {
    return this.http.get<Zone[]>(`${this.apiUrl}/zones`);
  }

  loadTables(zoneId: string) {
    this.http.get<HandheldTable[]>(`${this.apiUrl}/zones/${zoneId}/tables`)
      .subscribe(tables => this.tablesSubject.next(tables));
  }

  updateTableStatus(tableId: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/table/${tableId}/status`, { status });
  }

  saveLayout(zoneId: string, tables: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/layout/${zoneId}`, tables);
  }
}
