import { Component, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { ShiftService } from './services/shift.service';

import { ToastComponent } from './components/shared/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, ToastComponent],
  template: `
    <div class="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <!-- Header Pastel Premium -->
      <header *ngIf="authService.isLoggedIn()" class="h-24 glass-panel border-b border-white flex items-center px-10 justify-between sticky top-0 z-50">
        <div class="flex items-center space-x-5">
          <div style="width: 48px; height: 48px;" class="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center font-bold text-indigo-600 shadow-soft">
            <span class="text-2xl font-display">{{ userInitials() }}</span>
          </div>
          <div class="flex flex-col">
            <h1 class="text-2xl font-display font-bold tracking-tight text-slate-900 leading-tight">Antigravity POS</h1>
            <div class="flex items-center space-x-2">
              <span class="w-2 h-2 rounded-full" [ngClass]="shiftService.hasActiveShift() ? 'bg-green-400' : 'bg-slate-300'"></span>
              <span class="text-xs uppercase tracking-widest text-slate-400 font-bold">
                {{ shiftService.hasActiveShift() ? 'En Turno' : 'Fuera de Turno' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Navigation Dinámica por Rol -->
        <nav class="hidden lg:flex items-center bg-white/40 p-1.5 rounded-2xl border border-white shadow-soft">
          <!-- Sala: Disponible para Admin siempre, o para Camarero con turno -->
          <a *ngIf="authService.hasRole('ADMIN') || (authService.hasRole('WAITER') && shiftService.hasActiveShift())"
             routerLink="/floor-plan" 
             routerLinkActive="bg-white text-indigo-600 shadow-sm" 
             [routerLinkActiveOptions]="{exact: true}"
             class="px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:text-indigo-600">
            Sala
          </a>

          <!-- Cocina: Para Admin o Cocinero -->
          <a *ngIf="authService.hasRole('ADMIN') || authService.hasRole('KITCHEN')"
             routerLink="/kitchen" 
             routerLinkActive="bg-white text-indigo-600 shadow-sm" 
             class="px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:text-indigo-600">
            Cocina
          </a>

          <!-- Inventario y Diseñador: Solo Admin -->
          <ng-container *ngIf="authService.hasRole('ADMIN')">
            <a routerLink="/inventory" 
               routerLinkActive="bg-white text-indigo-600 shadow-sm" 
               class="px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:text-indigo-600">
              Inventario
            </a>
            <a routerLink="/floor-plan/edit" 
               routerLinkActive="bg-white text-indigo-600 shadow-sm"
               class="px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:text-indigo-600">
              Diseñador
            </a>
          </ng-container>
          
          <!-- Botón de Fichar (si no es admin o si quiere controlar su turno) -->
          <a routerLink="/shift" 
             routerLinkActive="bg-white text-indigo-600 shadow-sm" 
             class="px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:text-indigo-600">
            Jornada
          </a>
        </nav>


        <div class="flex items-center space-x-6">
          <div class="hidden sm:flex flex-col items-end">
            <span class="text-sm font-bold text-slate-700">{{ authService.currentUser()?.name }}</span>
            <span class="text-[11px] text-indigo-500 font-bold uppercase tracking-wider">{{ authService.currentUser()?.role }}</span>
          </div>
          <button (click)="logout()" 
                  title="Cerrar Sesión"
                  class="w-12 h-12 rounded-2xl bg-indigo-50 border border-white flex items-center justify-center text-indigo-600 font-bold shadow-soft hover:bg-rose-50 hover:text-rose-600 transition-all">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </button>
        </div>
      </header>

      <!-- Main Content Area (Ajuste dinámico según vista) -->
      <main class="flex-1 animate-slide-up w-full"
            [ngClass]="isPOSView() ? 'p-6' : 'p-10 max-w-7xl mx-auto'">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer Clean -->
      <footer class="h-16 bg-white/80 border-t border-slate-100 flex items-center px-10 justify-between text-xs font-bold text-slate-400 tracking-wider">
        <div class="flex items-center space-x-6">
          <span class="flex items-center"><span class="w-2 h-2 rounded-full bg-indigo-200 mr-2"></span> v1.0.0-PASTEL</span>
          <span>© 2026 Antigravity Systems</span>
        </div>
        <div class="flex items-center">
          <span class="text-slate-300 mr-3">Servidor:</span>
          <span class="text-green-500 flex items-center font-bold">
            <svg width="14" height="14" style="width: 14px; height: 14px;" class="mr-1.5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
            </svg>
            Operativo
          </span>
        </div>
      </footer>
      <app-toast></app-toast>
    </div>
  `,
  styles: [`
    @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  `]
})
export class AppComponent {
  authService = inject(AuthService);
  shiftService = inject(ShiftService);
  router = inject(Router);

  userInitials = computed(() => {
    const name = this.authService.currentUser()?.name || '';
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  });

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isPOSView = computed(() => {
    const url = this.router.url;
    return url.includes('/pos') || url.includes('/handheld');
  });
}
