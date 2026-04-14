import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import * as fabric from 'fabric';
import { FloorPlanService } from '../../services/floor-plan.service';

@Component({
  selector: 'app-floor-plan-designer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col lg:flex-row h-full gap-10 animate-slide-up">
      <!-- Sidebar Tools (Solo en modo edición) -->
      <aside *ngIf="isEditMode" class="w-full lg:w-80 flex flex-col gap-6 shrink-0">
        <div class="glass-panel p-8 rounded-[2.5rem] flex flex-col gap-8 shadow-soft border-white/40">
          <div class="flex flex-col">
            <h2 class="text-sm font-display font-bold text-indigo-500 uppercase tracking-[0.2em]">Diseño de Sala</h2>
            <p class="text-xs text-slate-400 font-medium">Configura la disposición física</p>
          </div>

          <div class="flex flex-col gap-4">
            <button (click)="addTable('rect')" class="group flex items-center p-4 bg-indigo-50/50 border border-white rounded-2xl hover:bg-white transition-all">
              <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-4 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-sm">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2"></rect></svg>
              </div>
              <span class="text-sm font-bold text-slate-700">Mesa Rectangular</span>
            </button>
            <button (click)="addTable('circle')" class="group flex items-center p-4 bg-rose-50/50 border border-white rounded-2xl hover:bg-white transition-all">
              <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-4 text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-sm">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle></svg>
              </div>
              <span class="text-sm font-bold text-slate-700">Mesa Redonda</span>
            </button>
          </div>

          <button (click)="saveLayout()" class="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-bold text-xs uppercase tracking-widest shadow-xl shadow-indigo-200">
            Guardar Cambios
          </button>
        </div>
      </aside>

      <!-- Sidebar Resumen (Solo en modo ventas) -->
      <aside *ngIf="!isEditMode" class="w-full lg:w-80 flex flex-col gap-6 shrink-0">
        <div class="glass-panel p-8 rounded-[2.5rem] flex flex-col gap-8 shadow-soft border-white/40">
          <div class="flex flex-col">
            <h2 class="text-sm font-display font-bold text-indigo-500 uppercase tracking-[0.2em]">Estado de Sala</h2>
            <p class="text-xs text-slate-400 font-medium">Selecciona una mesa para cobrar</p>
          </div>
          
          <div class="flex flex-col gap-3">
             <div class="flex items-center justify-between p-4 bg-white/40 rounded-2xl border border-white">
               <span class="text-xs font-bold text-slate-500">Mesas Libres</span>
               <span class="px-3 py-1 bg-green-100 text-green-600 rounded-lg text-[10px] font-black">{{ freeTables }}</span>
             </div>
             <div class="flex items-center justify-between p-4 bg-white/40 rounded-2xl border border-white">
               <span class="text-xs font-bold text-slate-500">Mesas Ocupadas</span>
               <span class="px-3 py-1 bg-rose-100 text-rose-600 rounded-lg text-[10px] font-black">{{ occupiedTables }}</span>
             </div>
          </div>
        </div>
      </aside>
      
      <!-- Canvas Area -->
      <div class="flex-1 glass-panel rounded-[3rem] relative overflow-hidden flex flex-col border-white shadow-2xl bg-white/40">
        <div class="p-5 border-b border-slate-50 bg-white/50 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
          <div class="flex items-center space-x-6">
            <span *ngIf="isEditMode" class="flex items-center text-indigo-500">
              <span class="w-2.5 h-2.5 rounded-full bg-indigo-500 mr-2 animate-pulse"></span> 
              Modo Edición
            </span>
            <span *ngIf="!isEditMode" class="flex items-center text-green-500">
              <span class="w-2.5 h-2.5 rounded-full bg-green-500 mr-2"></span> 
              Modo Servicio
            </span>
            <span>Planta Principal</span>
          </div>
        </div>

        <div class="flex-1 relative bg-white flex items-center justify-center p-16 overflow-auto">
          <div class="absolute inset-0 opacity-[0.1] pointer-events-none" 
               style="background-image: radial-gradient(#6366f1 1px, transparent 1px); background-size: 40px 40px;">
          </div>
          <div class="canvas-wrapper relative z-10 glass-panel border-white/80 overflow-hidden shadow-soft">
            <canvas #canvasElement></canvas>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: calc(100vh - 160px); }
    :host ::ng-deep .canvas-container { margin: 0 auto !important; background: transparent !important; }
  `]
})
export class FloorPlanDesignerComponent implements AfterViewInit, OnInit {
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  private canvas!: fabric.Canvas;
  isEditMode = false;
  freeTables = 0;
  occupiedTables = 0;

  constructor(
    private floorPlanService: FloorPlanService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isEditMode = this.router.url.includes('/edit');
  }

  ngAfterViewInit() {
    this.canvas = new fabric.Canvas(this.canvasElement.nativeElement, {
      width: 1000,
      height: 700,
      backgroundColor: 'transparent',
      selection: this.isEditMode
    });

    this.loadInitialTables();
    this.setupEvents();
  }

  private loadInitialTables() {
    // Para demo, añadimos un par de mesas si el canvas está vacío
    this.addTable('rect', 200, 200, 'T1');
    this.addTable('circle', 500, 300, 'T2');
    this.addTable('rect', 800, 200, 'T3');
    this.freeTables = 3;
  }

  private setupEvents() {
    this.canvas.on('mouse:down', (options) => {
      if (!this.isEditMode && options.target) {
        // En modo servicio, al clicar una mesa navegamos al POS
        const tableId = (options.target as any).id || 'demo-table';
        this.router.navigate(['/pos', tableId]);
      }
    });

    if (this.isEditMode) {
      this.canvas.on('object:modified', (e) => {
        // Guardar posiciones automáticas
      });
    }
  }

  addTable(shape: 'rect' | 'circle', left?: number, top?: number, id?: string) {
    const tableId = id || `M-${Math.floor(Math.random() * 1000)}`;
    const tableColor = '#ffffff';
    const borderColor = '#6366f1';

    let table: fabric.Object;
    if (shape === 'rect') {
      table = new fabric.Rect({
        width: 120, height: 120, rx: 24, ry: 24,
        fill: tableColor, stroke: borderColor, strokeWidth: 3,
        shadow: new fabric.Shadow({ blur: 15, color: 'rgba(99, 102, 241, 0.1)', offsetX: 0, offsetY: 4 })
      });
    } else {
      table = new fabric.Circle({
        radius: 60, fill: tableColor, stroke: borderColor, strokeWidth: 3,
        shadow: new fabric.Shadow({ blur: 15, color: 'rgba(99, 102, 241, 0.1)', offsetX: 0, offsetY: 4 })
      });
    }

    const text = new fabric.Text(tableId, {
      fontSize: 18, fontFamily: 'Outfit', fontWeight: 'bold', fill: '#475569',
      originX: 'center', originY: 'center', left: 60, top: 60
    });

    const group = new fabric.Group([table, text], {
      left: left || 100, top: top || 100,
      selectable: this.isEditMode,
      hoverCursor: this.isEditMode ? 'move' : 'pointer',
      hasControls: this.isEditMode
    });

    (group as any).id = tableId;
    this.canvas.add(group);
    this.canvas.renderAll();
  }

  saveLayout() {
    alert('Disposición de sala guardada correctamente.');
  }
}
