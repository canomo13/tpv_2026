import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
      <header class="h-16 bg-slate-900 border-b border-slate-800 flex items-center px-6 justify-between shadow-lg">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">G</div>
          <h1 class="text-xl font-bold tracking-tight text-white">Antigravity POS <span class="text-blue-500">2026</span></h1>
        </div>
        <nav class="flex space-x-4">
          <a routerLink="/floor-plan" routerLinkActive="text-blue-400 bg-slate-800" class="px-4 py-2 rounded-lg hover:bg-slate-800 transition">Diseñador</a>
          <a class="px-4 py-2 rounded-lg hover:bg-slate-800 transition opacity-50 cursor-not-allowed">Ventas</a>
          <a class="px-4 py-2 rounded-lg hover:bg-slate-800 transition opacity-50 cursor-not-allowed">Inventario</a>
        </nav>
        <div class="flex items-center space-x-4">
          <button class="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
            <span class="text-xs">JA</span>
          </button>
        </div>
      </header>

      <main class="flex-1 p-6">
        <router-outlet></router-outlet>
      </main>

      <footer class="h-10 bg-slate-900 border-t border-slate-800 flex items-center px-6 justify-between text-xs text-slate-500">
        <div>v1.0.0-beta</div>
        <div>Estado: <span class="text-green-500">Conectado</span></div>
      </footer>
    </div>
  `
})
export class AppComponent {}
