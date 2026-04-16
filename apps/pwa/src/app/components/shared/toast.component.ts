import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 pointer-events-none">
      <div *ngFor="let toast of toastService.toasts()" 
           class="pointer-events-auto min-w-[320px] max-w-md bg-white/80 backdrop-blur-xl border border-white rounded-3xl p-5 shadow-2xl flex items-center gap-4 animate-slide-in cursor-pointer"
           [ngClass]="{
             'border-emerald-200 shadow-emerald-100/30': toast.type === 'success',
             'border-rose-200 shadow-rose-100/30': toast.type === 'error',
             'border-indigo-200 shadow-indigo-100/30': toast.type === 'info',
             'border-amber-200 shadow-amber-100/30': toast.type === 'warning'
           }"
           (click)="toastService.remove(toast.id)">
        
        <!-- Iconos -->
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
             [ngClass]="{
               'bg-emerald-500 text-white': toast.type === 'success',
               'bg-rose-500 text-white': toast.type === 'error',
               'bg-indigo-500 text-white': toast.type === 'info',
               'bg-amber-500 text-white': toast.type === 'warning'
             }">
          <svg *ngIf="toast.type === 'success'" width="24" height="24" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg>
          <svg *ngIf="toast.type === 'error'" width="24" height="24" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
          <svg *ngIf="toast.type === 'info'" width="24" height="24" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <svg *ngIf="toast.type === 'warning'" width="24" height="24" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>

        <div class="flex-1">
          <p class="text-[10px] font-black uppercase tracking-widest mb-0.5"
             [ngClass]="{
               'text-emerald-500': toast.type === 'success',
               'text-rose-500': toast.type === 'error',
               'text-indigo-500': toast.type === 'info',
               'text-amber-500': toast.type === 'warning'
             }">{{ toast.type }}</p>
          <p class="text-sm font-bold text-slate-700 leading-tight tracking-tight">{{ toast.message }}</p>
        </div>

        <button class="text-slate-300 hover:text-slate-500 transition-colors">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slide-in {
      from { opacity: 0; transform: translateY(-20px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .animate-slide-in {
      animation: slide-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
