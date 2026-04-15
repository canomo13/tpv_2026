import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ShiftService } from '../../services/shift.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div class="w-full max-w-md bg-white rounded-[3rem] shadow-2xl p-10 relative overflow-hidden flex flex-col items-center">
        <!-- Decoración de fondo -->
        <div class="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
        <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-rose-50 rounded-full blur-3xl opacity-50"></div>

        <!-- Logo/Header -->
        <div class="relative z-10 text-center mb-10">
          <div class="w-20 h-20 bg-indigo-600 rounded-[2rem] mx-auto mb-6 flex items-center justify-center shadow-xl shadow-indigo-100 rotate-12">
            <svg width="40" height="40" fill="none" stroke="white" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17"></path></svg>
          </div>
          <h1 class="text-4xl font-display font-black text-slate-800 tracking-tight italic">Pastel<span class="text-indigo-600">Premium</span></h1>
          <p class="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Sistema de Gestión de Hostelería</p>
        </div>

        <!-- Selector de Login -->
        <div class="flex bg-slate-100 p-1.5 rounded-2xl w-full mb-8 relative z-10">
          <button (click)="loginMode.set('pin')" 
                  [class.bg-white]="loginMode() === 'pin'"
                  [class.shadow-sm]="loginMode() === 'pin'"
                  [class.text-indigo-600]="loginMode() === 'pin'"
                  class="flex-1 py-3 rounded-xl text-sm font-bold transition-all text-slate-400">
            Acceso Rápido (PIN)
          </button>
          <button (click)="loginMode.set('email')" 
                  [class.bg-white]="loginMode() === 'email'"
                  [class.shadow-sm]="loginMode() === 'email'"
                  [class.text-indigo-600]="loginMode() === 'email'"
                  class="flex-1 py-3 rounded-xl text-sm font-bold transition-all text-slate-400">
            Administración
          </button>
        </div>

        <!-- FORM: PIN -->
        <div *ngIf="loginMode() === 'pin'" class="w-full relative z-10 animate-fade-in">
          <div class="flex justify-center gap-3 mb-8">
            <div *ngFor="let i of [1,2,3,4]" 
                 class="w-4 h-4 rounded-full border-2 border-slate-200 transition-all duration-300"
                 [class.bg-indigo-600]="pin().length >= i"
                 [class.border-indigo-600]="pin().length >= i"
                 [class.scale-110]="pin().length === i - 1"></div>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <button *ngFor="let n of digits" 
                    (click)="addDigit(n)"
                    class="h-20 w-full bg-white border border-slate-100 rounded-[1.5rem] text-2xl font-black text-slate-700 hover:bg-indigo-50 hover:border-indigo-100 hover:text-indigo-600 hover:scale-105 active:scale-95 transition-all shadow-sm">
              {{ n }}
            </button>
            <button (click)="clearPin()" class="h-20 w-full bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
              <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <button (click)="addDigit('0')" class="h-20 w-full bg-white border border-slate-100 rounded-[1.5rem] text-2xl font-black text-slate-700 hover:bg-indigo-50 hover:scale-105 transition-all shadow-sm">0</button>
            <button (click)="submitPin()" class="h-20 w-full bg-indigo-600 text-white rounded-[1.5rem] flex items-center justify-center hover:bg-slate-800 transition-all shadow-xl shadow-indigo-100">
              <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg>
            </button>
          </div>
        </div>

        <!-- FORM: EMAIL -->
        <div *ngIf="loginMode() === 'email'" class="w-full relative z-10 animate-fade-in flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Empresa / Email</label>
            <input [(ngModel)]="email" type="email" placeholder="admin@pastelpremium.com" 
                   class="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 shadow-inner outline-none focus:ring-2 ring-indigo-100 transition-all">
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Contraseña Segura</label>
            <input [(ngModel)]="password" type="password" placeholder="••••••••" 
                   class="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 shadow-inner outline-none focus:ring-2 ring-indigo-100 transition-all">
          </div>
          <button (click)="submitEmail()" 
                  class="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-indigo-200 hover:scale-[1.02] active:scale-95 transition-all mt-4">
            Entrar al Panel
          </button>
        </div>

        <p *ngIf="error()" class="mt-6 text-rose-500 font-bold text-sm animate-bounce">{{ error() }}</p>
      </div>

      <div class="fixed bottom-8 text-slate-300 text-[10px] font-black uppercase tracking-[0.3em]">
        Pastel Premium POS v2.0 • 2026 Edition
      </div>
    </div>
  `,
  styles: [`
    @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
  `]
})
export class LoginComponent {
  loginMode = signal<'pin' | 'email'>('pin');
  pin = signal<string>('');
  email = '';
  password = '';
  error = signal<string | null>(null);

  digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  constructor(
    private authService: AuthService, 
    private shiftService: ShiftService,
    private router: Router
  ) {}

  addDigit(digit: string) {
    if (this.pin().length < 4) {
      this.pin.set(this.pin() + digit);
      if (this.pin().length === 4) {
        this.submitPin();
      }
    }
  }

  clearPin() {
    this.pin.set('');
    this.error.set(null);
  }

  submitPin() {
    this.authService.loginPin(this.pin()).subscribe({
      next: (res) => this.navigateByRole(res.user.role),
      error: () => {
        this.error.set('PIN incorrecto');
        this.pin.set('');
      }
    });
  }

  submitEmail() {
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => this.navigateByRole(res.user.role),
      error: () => this.error.set('Credenciales inválidas')
    });
  }

  private navigateByRole(role: string) {
    // Tras login, cargamos el turno y vamos a la pantalla de estado de jornada
    this.shiftService.loadCurrentShift().subscribe(() => {
      this.router.navigate(['/shift']);
    });
  }
}
