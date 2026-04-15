import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService, BusinessSettings } from '../../services/settings.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-8 max-w-4xl mx-auto animate-slide-up">
      <header class="mb-10 flex justify-between items-end">
        <div>
          <h1 class="text-4xl font-display font-black text-slate-800 italic tracking-tighter">Mi <span class="text-indigo-600">Negocio</span></h1>
          <p class="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Configuración Fiscal y Visual del Sistema</p>
        </div>
        <button (click)="save()" 
                class="px-10 py-4 bg-slate-800 text-white rounded-2xl font-black text-sm shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all">
          GUARDAR CAMBIOS
        </button>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Columna Datos -->
        <div class="lg:col-span-2 space-y-6">
          <section class="glass-panel p-8 rounded-[3rem] bg-white/60 shadow-xl border-white space-y-6">
            <h2 class="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-4">Datos Identificativos</h2>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nombre Comercial</label>
                <input [(ngModel)]="settings.name" placeholder="Ej: Pastel Premium" 
                       class="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 shadow-inner outline-none focus:ring-2 ring-indigo-100 transition-all">
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Razón Social</label>
                <input [(ngModel)]="settings.companyName" placeholder="Ej: Pastelero S.L." 
                       class="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 shadow-inner outline-none focus:ring-2 ring-indigo-100 transition-all">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">CIF / NIF</label>
                <input [(ngModel)]="settings.cif" placeholder="B12345678" 
                       class="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 shadow-inner outline-none focus:ring-2 ring-indigo-100 transition-all">
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Teléfono</label>
                <input [(ngModel)]="settings.phone" placeholder="+34 600 000 000" 
                       class="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 shadow-inner outline-none focus:ring-2 ring-indigo-100 transition-all">
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Dirección Fiscal</label>
              <input [(ngModel)]="settings.address" placeholder="C/ Principal, 1, 28001 Madrid" 
                     class="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 shadow-inner outline-none focus:ring-2 ring-indigo-100 transition-all">
            </div>
          </section>

          <section class="glass-panel p-8 rounded-[3rem] bg-white/60 shadow-xl border-white space-y-6">
            <h2 class="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-4">Marketing y Ticket</h2>
            
            <div class="flex flex-col gap-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Redes Sociales (Linktree / Instagram)</label>
              <input [(ngModel)]="settings.socialMediaUrl" placeholder="https://instagram.com/tu-perfil" 
                     class="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 shadow-inner outline-none focus:ring-2 ring-indigo-100 transition-all">
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Pie de Ticket</label>
              <textarea [(ngModel)]="settings.footerMessage" rows="2" 
                        class="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 shadow-inner outline-none focus:ring-2 ring-indigo-100 transition-all"></textarea>
            </div>
          </section>
        </div>

        <!-- Columna Visual/Logo -->
        <div class="space-y-6">
          <section class="glass-panel p-8 rounded-[3rem] bg-white/60 shadow-xl border-white flex flex-col items-center">
            <h2 class="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 w-full text-center">Logotipo SVG</h2>
            
            <div class="w-40 h-40 bg-slate-50 rounded-[2rem] flex items-center justify-center border-2 border-dashed border-slate-200 overflow-hidden mb-6 group hover:border-indigo-200 transition-all cursor-pointer relative">
               <div *ngIf="settings.logoSvg" [innerHTML]="settings.logoSvg" class="w-full h-full p-4 flex items-center justify-center"></div>
               <div *ngIf="!settings.logoSvg" class="flex flex-col items-center text-slate-300">
                  <svg width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <span class="text-[10px] font-black uppercase mt-2">Subir SVG</span>
               </div>
               <input type="file" (change)="handleLogoUpload($event)" accept=".svg" class="absolute inset-0 opacity-0 cursor-pointer">
            </div>
            
            <p class="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
              El logo aparecerá en la cabecera de todos sus tickets impresos.
            </p>
          </section>

          <section *ngIf="settings.socialMediaUrl" class="glass-panel p-8 rounded-[3rem] bg-white/60 shadow-xl border-white flex flex-col items-center">
             <h2 class="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">QR Preview</h2>
             <img [src]="'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + settings.socialMediaUrl" 
                  class="w-32 h-32 rounded-2xl shadow-lg border-4 border-white">
             <p class="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest mt-4">Escanee para ver sus redes</p>
          </section>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent implements OnInit {
  settings: BusinessSettings = {
    name: 'Pastel Premium',
    companyName: '',
    cif: '',
    address: '',
    phone: '',
    logoSvg: '',
    socialMediaUrl: '',
    footerMessage: 'Gracias por su visita'
  };

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    this.settingsService.getSettings().subscribe(res => {
      this.settings = res;
    });
  }

  handleLogoUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.settings.logoSvg = e.target.result;
      };
      reader.readAsText(file);
    }
  }

  save() {
    this.settingsService.updateSettings(this.settings).subscribe({
      next: () => alert('Configuración guardada correctamente'),
      error: () => alert('Error al guardar configuración')
    });
  }
}
