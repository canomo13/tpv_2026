import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <!-- Header Pastel Premium -->
      <header class="h-24 glass-panel border-b border-white flex items-center px-10 justify-between sticky top-0 z-50">
        <div class="flex items-center space-x-5">
          <div style="width: 48px; height: 48px;" class="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center font-bold text-indigo-600 shadow-soft">
            <span class="text-2xl font-display">A</span>
          </div>
          <div class="flex flex-col">
            <h1 class="text-2xl font-display font-bold tracking-tight text-slate-900 leading-tight">Antigravity POS</h1>
            <div class="flex items-center space-x-2">
              <span class="w-2 h-2 rounded-full bg-green-400"></span>
              <span class="text-xs uppercase tracking-widest text-slate-400 font-bold">Cloud Workspace 2026</span>
            </div>
          </div>
        </div>

        <nav class="hidden lg:flex items-center bg-white/40 p-1.5 rounded-2xl border border-white shadow-soft">
          <a routerLink="/floor-plan" 
             routerLinkActive="bg-white text-indigo-600 shadow-sm" 
             [routerLinkActiveOptions]="{exact: true}"
             class="px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:text-indigo-600">
            Ventas
          </a>
          <a routerLink="/inventory" 
             routerLinkActive="bg-white text-indigo-600 shadow-sm" 
             class="px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:text-indigo-600">
            Inventario
          </a>
          <a routerLink="/floor-plan/edit" 
             class="px-8 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-indigo-400">Diseñador</a>
        </nav>

        <div class="flex items-center space-x-6">
          <div class="hidden sm:flex flex-col items-end">
            <span class="text-sm font-bold text-slate-700">Jose Antonio</span>
            <span class="text-[11px] text-indigo-500 font-bold uppercase">Administrador</span>
          </div>
          <button class="w-12 h-12 rounded-2xl bg-indigo-50 border border-white flex items-center justify-center text-indigo-600 font-bold shadow-soft hover:bg-white transition-colors">
            JA
          </button>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="flex-1 p-10 max-w-7xl mx-auto w-full animate-slide-up">
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
    </div>
  `
})
export class AppComponent {}
