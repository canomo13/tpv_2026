import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter([
      {
        path: 'floor-plan',
        loadComponent: () => import('./components/floor-plan-designer/floor-plan-designer.component').then(m => m.FloorPlanDesignerComponent)
      },
      {
        path: 'floor-plan/edit',
        loadComponent: () => import('./components/floor-plan-designer/floor-plan-designer.component').then(m => m.FloorPlanDesignerComponent)
      },
      {
        path: 'inventory',
        loadComponent: () => import('./components/inventory/inventory.component').then(m => m.InventoryComponent)
      },
      {
        path: 'pos/:tableId',
        loadComponent: () => import('./components/pos/pos.component').then(m => m.POSComponent)
      },
      { path: '', redirectTo: 'floor-plan', pathMatch: 'full' }
    ])
  ]
};
