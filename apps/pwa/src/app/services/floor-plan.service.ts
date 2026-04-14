import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Table, UpdateTableLayoutDto } from '@tpv/shared';

@Injectable({
  providedIn: 'root'
})
export class FloorPlanService {
  private tablesSubject = new BehaviorSubject<Table[]>([]);
  tables$ = this.tablesSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadTables(zoneId: string) {
    // TODO: Impl API call
    // this.http.get<Table[]>(`/api/floor-plan/zones/${zoneId}/tables`)
    //   .subscribe(tables => this.tablesSubject.next(tables));
  }

  addTable(table: Partial<Table>) {
    const current = this.tablesSubject.value;
    // In a real app, this would be an API call
    const newTable: Table = {
      id: Math.random().toString(36).substr(2, 9),
      number: current.length + 1,
      x: table.x || 100,
      y: table.y || 100,
      width: table.width || 60,
      height: table.height || 60,
      shape: table.shape || 'rect',
      status: 'free',
      zoneId: 'default'
    };
    this.tablesSubject.next([...current, newTable]);
  }

  updateLayout(updates: UpdateTableLayoutDto[]) {
    const current = this.tablesSubject.value;
    const next = current.map(table => {
      const update = updates.find(u => u.id === table.id);
      return update ? { ...table, ...update } : table;
    });
    this.tablesSubject.next(next);
  }

  saveLayout() {
    const tables = this.tablesSubject.value;
    console.log('Guardando diseño en API:', tables);
    // TODO: API POST call
    return true;
  }
}
