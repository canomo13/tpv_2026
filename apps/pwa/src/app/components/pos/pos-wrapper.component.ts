import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fromEvent, map, startWith } from 'rxjs';
import { POSComponent } from './pos.component';
import { HandheldPosComponent } from './handheld-pos.component';

@Component({
  selector: 'app-pos-wrapper',
  standalone: true,
  imports: [CommonModule, POSComponent, HandheldPosComponent],
  template: `
    <ng-container *ngIf="isMobile$ | async; else desktopView">
      <app-handheld-pos></app-handheld-pos>
    </ng-container>
    <ng-template #desktopView>
      <app-pos></app-pos>
    </ng-template>
  `
})
export class PosWrapperComponent {
  // Detector de tamaño de pantalla nativo (sin dependencias externas)
  isMobile$ = fromEvent(window, 'resize').pipe(
    startWith(null), // Disparar valor inicial
    map(() => typeof window !== 'undefined' ? window.innerWidth < 1024 : false)
  );
}
