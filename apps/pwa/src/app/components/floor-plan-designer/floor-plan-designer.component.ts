import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as fabric from 'fabric';
import { FloorPlanService } from '../../services/floor-plan.service';

@Component({
  selector: 'app-floor-plan-designer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col h-[calc(100vh-160px)] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
      <!-- Toolbar -->
      <div class="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <h2 class="text-xl font-bold text-white uppercase tracking-wider">Diseñador de Sala</h2>
          <div class="h-6 w-px bg-slate-700"></div>
          <p class="text-slate-400 text-sm italic">Arrastra los elementos para cambiar su posición</p>
        </div>
        <div class="flex space-x-3">
          <button (click)="addTable('rect')" class="flex items-center px-4 py-2 bg-blue-600/10 text-blue-400 border border-blue-600/20 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300">
            <span class="mr-2 text-lg">+</span> Mesa Rectangular
          </button>
          <button (click)="addTable('circle')" class="flex items-center px-4 py-2 bg-blue-600/10 text-blue-400 border border-blue-600/20 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300">
            <span class="mr-2 text-lg">+</span> Mesa Redonda
          </button>
          <button (click)="saveLayout()" class="flex items-center px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 shadow-lg shadow-green-900/20 transition-all duration-300">
            Guardar Diseño
          </button>
        </div>
      </div>
      
      <!-- Canvas Area -->
      <div class="flex-1 bg-[#0f172a] relative overflow-hidden flex items-center justify-center p-8">
        <div class="canvas-container-shadow rounded-lg overflow-hidden border-2 border-slate-700 shadow-2xl">
          <canvas #canvasElement></canvas>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="px-6 py-3 bg-slate-900 border-t border-slate-800 flex justify-between text-xs text-slate-500">
        <div class="flex space-x-4">
          <span>Mesas totales: {{ tablesCount }}</span>
          <span>Zoom: 100%</span>
        </div>
        <div>Usa Ctrl + Clic para seleccionar múltiples</div>
      </div>
    </div>
  `,
  styles: [`
    .canvas-container-shadow {
      box-shadow: 0 0 50px rgba(0,0,0,0.5);
    }
    :host ::ng-deep .canvas-container {
      margin: 0 auto !important;
    }
  `]
})
export class FloorPlanDesignerComponent implements AfterViewInit, OnInit {
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  private canvas!: fabric.Canvas;
  tablesCount = 0;

  constructor(private floorPlanService: FloorPlanService) {}

  ngOnInit() {
    this.floorPlanService.tables$.subscribe(tables => {
      this.tablesCount = tables.length;
      // In a real app, we would update the canvas based on the service state
    });
  }

  ngAfterViewInit() {
    this.canvas = new fabric.Canvas(this.canvasElement.nativeElement, {
      width: 1000,
      height: 700,
      backgroundColor: '#0f172a'
    });

    this.renderGrid();
    this.setupEvents();
  }

  private setupEvents() {
    this.canvas.on('object:modified', (e) => {
      const obj = e.target;
      if (obj) {
        console.log('Objeto movido/redimensionado:', obj.left, obj.top);
        // Actualizar servicio
      }
    });
  }

  addTable(shape: 'rect' | 'circle') {
    let table: fabric.Object;
    const color = '#3b82f6';

    if (shape === 'rect') {
      table = new fabric.Rect({
        left: 100,
        top: 100,
        fill: color,
        width: 80,
        height: 80,
        rx: 12,
        ry: 12,
        stroke: '#fff',
        strokeWidth: 2,
        shadow: new fabric.Shadow({ blur: 15, color: 'rgba(59, 130, 246, 0.4)' })
      });
    } else {
      table = new fabric.Circle({
        left: 150,
        top: 150,
        fill: color,
        radius: 40,
        stroke: '#fff',
        strokeWidth: 2,
        shadow: new fabric.Shadow({ blur: 15, color: 'rgba(59, 130, 246, 0.4)' })
      });
    }

    const text = new fabric.Text(`T${this.tablesCount + 1}`, {
      fontSize: 16,
      fontWeight: 'bold',
      fill: '#fff',
      originX: 'center',
      originY: 'center',
      left: 100,
      top: 100
    });

    const group = new fabric.Group([table, text], {
      left: 200,
      top: 200,
      hasControls: true,
      cornerColor: '#fff',
      cornerStrokeColor: color,
      cornerSize: 8,
      transparentCorners: false
    });

    this.canvas.add(group);
    this.canvas.setActiveObject(group);
    
    // Notificar al servicio
    this.floorPlanService.addTable({ shape, x: 200, y: 200 });
  }

  renderGrid() {
    const grid = 50;
    for (let i = 0; i < (1000 / grid); i++) {
      this.canvas.add(new fabric.Line([i * grid, 0, i * grid, 700], { stroke: '#1e293b', selectable: false }));
      this.canvas.add(new fabric.Line([0, i * grid, 1000, i * grid], { stroke: '#1e293b', selectable: false }));
    }
  }

  saveLayout() {
    this.floorPlanService.saveLayout();
    alert('Diseño de sala guardado correctamente.');
  }
}
