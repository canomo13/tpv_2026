import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { authGuard } from './guards/auth.guard';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter([
      {
        path: 'login',
        loadComponent: () => import('./components/auth/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'shift',
        canActivate: [authGuard],
        loadComponent: () => import('./components/auth/shift-status.component').then(m => m.ShiftStatusComponent)
      },
      {
        path: 'floor-plan',
        canActivate: [authGuard],
        data: { role: 'ADMIN' },
        loadComponent: () => import('./components/floor-plan-designer/floor-plan-designer.component').then(m => m.FloorPlanDesignerComponent)
      },
      {
        path: 'floor-plan/edit',
        canActivate: [authGuard],
        data: { role: 'ADMIN' },
        loadComponent: () => import('./components/floor-plan-designer/floor-plan-designer.component').then(m => m.FloorPlanDesignerComponent)
      },
      {
        path: 'inventory',
        canActivate: [authGuard],
        data: { role: 'ADMIN' },
        loadComponent: () => import('./components/inventory/inventory.component').then(m => m.InventoryComponent)
      },
      {
        path: 'pos/:tableId',
        canActivate: [authGuard],
        loadComponent: () => import('./components/pos/pos-wrapper.component').then(m => m.PosWrapperComponent)
      },
      {
        path: 'handheld',
        canActivate: [authGuard],
        loadComponent: () => import('./components/pos/pos-wrapper.component').then(m => m.PosWrapperComponent)
      },
      {
        path: 'kitchen',
        canActivate: [authGuard],
        data: { role: 'KITCHEN' },
        loadComponent: () => import('./components/kitchen/kitchen.component').then(m => m.KitchenComponent)
      },
      {
        path: 'settings',
        canActivate: [authGuard],
        data: { role: 'ADMIN' },
        loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent)
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ])

  ]
};

