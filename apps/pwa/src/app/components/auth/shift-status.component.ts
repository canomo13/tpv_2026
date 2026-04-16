import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShiftService } from '../../services/shift.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-shift-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-screen bg-slate-50 flex flex-col items-center justify-center p-8 animate-fade-in select-none">
      
      <!-- Card Central -->
      <div class="w-full max-w-md bg-white rounded-[3rem] shadow-2xl shadow-indigo-100 p-10 border-white border-2 flex flex-col items-center text-center">
        
        <!-- Avatar/User Info -->
        <div class="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-6 shadow-inner">
           <svg width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        </div>
        
        <h1 class="text-3xl font-black text-slate-800 tracking-tighter italic">{{ authService.currentUser()?.name }}</h1>
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 mb-10">Control de Jornada • {{ authService.currentUser()?.role }}</p>

        <!-- Status & Timer -->
        <div class="w-full bg-slate-50 rounded-3xl p-8 mb-10 space-y-4">
           <div class="flex items-center justify-center gap-3">
              <div class="w-2.5 h-2.5 rounded-full animate-pulse" 
                   [ngClass]="shiftService.hasActiveShift() ? 'bg-emerald-500' : 'bg-rose-500'"></div>
              <span class="text-xs font-black uppercase tracking-widest"
                    [ngClass]="shiftService.hasActiveShift() ? 'text-emerald-500' : 'text-rose-500'">
                {{ shiftService.hasActiveShift() ? 'Jornada Iniciada' : 'Fuera de Turno' }}
              </span>
           </div>

           <div *ngIf="shiftService.hasActiveShift()" class="flex flex-col">
              <span class="text-4xl font-mono font-black text-slate-800 tracking-tighter">{{ duration() }}</span>
              <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Tiempo Trabajado Hoy</span>
           </div>
           
           <div *ngIf="!shiftService.hasActiveShift()" class="py-2">
              <p class="text-[11px] font-bold text-slate-400 italic px-6">Para empezar a tomar comandas, debes registrar tu entrada.</p>
           </div>
        </div>

        <!-- Acciones -->
        <div class="w-full space-y-4">
           <button *ngIf="!shiftService.hasActiveShift()" 
                   (click)="clockIn()" 
                   class="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest">
             Iniciar Jornada
           </button>

           <div *ngIf="shiftService.hasActiveShift()" class="space-y-4">
              <button (click)="goHome()" 
                      class="w-full py-6 bg-slate-800 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest">
                Entrar al POS
              </button>
              
              <button (click)="clockOut()" 
                      class="w-full py-4 text-rose-500 font-black text-xs uppercase tracking-widest hover:bg-rose-50 rounded-2xl transition-all">
                Finalizar Jornada
              </button>
           </div>
        </div>

      </div>

      <!-- Logout -->
      <button (click)="logout()" class="mt-8 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-indigo-600 transition-all flex items-center gap-2">
         <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
         Cerrar Sesión (Cambiar Usuario)
      </button>
    </div>
  `,
  styles: [`
    @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fade-in 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
  `]
})
export class ShiftStatusComponent implements OnInit {
  now = signal(new Date());
  
  duration = computed(() => {
    const shift = this.shiftService.currentShift();
    if (!shift) return '00:00:00';
    
    const start = new Date(shift.startTime).getTime();
    const current = this.now().getTime();
    const diff = current - start;
    
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return [hours, minutes, seconds]
      .map(v => v.toString().padStart(2, '0'))
      .join(':');
  });

  constructor(
    public shiftService: ShiftService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.shiftService.loadCurrentShift().subscribe();
    
    // Timer para refrescar la duración cada segundo
    setInterval(() => {
      this.now.set(new Date());
    }, 1000);
  }

  clockIn() {
    this.shiftService.clockIn().subscribe();
  }

  clockOut() {
    if (confirm('¿Estás seguro de que deseas finalizar tu jornada laboral?')) {
      this.shiftService.clockOut().subscribe();
    }
  }

  goHome() {
    const role = this.authService.currentUser()?.role;
    if (role === 'KITCHEN') {
      this.router.navigate(['/kitchen']);
    } else if (role === 'WAITER' || role === 'ADMIN') {
      this.router.navigate(['/handheld']);
    } else {
      this.router.navigate(['/shift']);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
