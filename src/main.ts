import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="font-family: 'Inter', sans-serif; background: #f0f2f0; min-height: 100vh; display: flex; flex-direction: column;">
      
      <nav style="background: #0d260a; color: white; padding: 15px 40px; display: flex; justify-content: space-between; align-items: center; border-bottom: 4px solid #27ae60;">
        <div style="display: flex; align-items: center; gap: 15px;">
          <div style="background: #27ae60; padding: 8px; border-radius: 8px;">🛰️</div>
          <h1 style="margin: 0; font-size: 1.5em; letter-spacing: 2px;">AGRO-TECH <span style="color: #27ae60;">MISIONES</span></h1>
        </div>
        <div style="font-size: 0.9em; opacity: 0.8; text-align: right;">
          <strong>Lucía Iacono</strong><br>
          Sistema de Teledetección
        </div>
      </nav>

      <div style="display: flex; flex: 1; padding: 25px; gap: 25px; max-width: 1400px; margin: 0 auto; width: 100%;">
        
        <aside style="width: 280px; display: flex; flex-direction: column; gap: 20px;">
          
          <div style="background: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <h4 style="margin-top: 0; color: #1b3d17; border-bottom: 1px solid #eee; padding-bottom: 10px;">FILTROS RÁPIDOS</h4>
            <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 15px;">
              <button (click)="filtroEstado = 'todos'" [class.active]="filtroEstado === 'todos'" class="filter-btn">Todos los Lotes</button>
              <button (click)="filtroEstado = 'critico'" [class.active]="filtroEstado === 'critico'" class="filter-btn red">⚠️ Críticos</button>
              <button (click)="filtroEstado = 'alerta'" [class.active]="filtroEstado === 'alerta'" class="filter-btn orange">⚡ Alerta (Naranja)</button>
              <button (click)="filtroEstado = 'sano'" [class.active]="filtroEstado === 'sano'" class="filter-btn green">✅ Sanos</button>
            </div>
          </div>

          <div style="background: #1b3d17; color: white; padding: 20px; border-radius: 15px; text-align: center;">
            <p style="margin: 0; font-size: 0.8em; opacity: 0.7;">PROMEDIO REGIONAL</p>
            <h2 style="margin: 10px 0; font-size: 2.5em;">{{ calcularPromedio() }}%</h2>
            <button (click)="simularClima()" style="width: 100%; padding: 10px; border-radius: 8px; border: none; background: #27ae60; color: white; cursor: pointer; font-weight: bold; transition: 0.2s;">
              REESCANEAR ZONA
            </button>
          </div>

          <div *ngIf="loteSeleccionado" style="background: #eef7ee; padding: 20px; border-radius: 15px; border-left: 5px solid #27ae60; animation: slideIn 0.3s; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <h4 style="margin-top: 0; color: #1b3d17; font-size: 0.9em;">📋 RECOMENDACIÓN</h4>
            <p style="font-size: 0.85em; line-height: 1.4; color: #333; margin-bottom: 0;">
              <strong>{{ loteSeleccionado.nombre }}:</strong><br>
              {{ getRecomendacion(loteSeleccionado.salud) }}
            </p>
          </div>
        </aside>

        <main style="flex: 1;">
          <div style="margin-bottom: 20px; display: flex; gap: 15px;">
            <input [(ngModel)]="busqueda" placeholder="Buscar por nombre de lote o tipo de cultivo..." 
                   style="flex: 1; padding: 15px; border-radius: 12px; border: none; box-shadow: 0 4px 6px rgba(0,0,0,0.05); outline: none;">
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;">
            <div *ngFor="let lote of lotesFiltrados()" 
                 (click)="seleccionarLote(lote)"
                 class="lote-card"
                 [class.selected]="loteSeleccionado === lote"
                 [style.border-top]="'6px solid ' + getColor(lote.salud)">
              
              <div style="padding: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                  <div>
                    <h3 style="margin: 0; color: #1b3d17;">{{ lote.nombre }}</h3>
                    <small style="color: #666; font-weight: bold;">{{ lote.tipo }}</small>
                  </div>
                  <div [style.background]="getColor(lote.salud)" style="color: white; padding: 5px 10px; border-radius: 8px; font-weight: bold; font-size: 0.9em;">
                    {{ lote.salud * 100 | number:'1.0-0' }}%
                  </div>
                </div>

                <div style="background: #f0f0f0; height: 8px; border-radius: 4px; margin-bottom: 20px; overflow: hidden;">
                  <div [style.width.%]="lote.salud * 100" [style.background]="getColor(lote.salud)" style="height: 100%; transition: 1s ease-in-out;"></div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.8em; color: #777;">
                  <div style="background: #f9f9f9; padding: 8px; border-radius: 5px;">
                    <strong>HUMEDAD</strong><br>42%
                  </div>
                  <div style="background: #f9f9f9; padding: 8px; border-radius: 5px;">
                    <strong>NDVI</strong><br>{{ (lote.salud * 0.9).toFixed(2) }}
                  </div>
                </div>

                <div style="margin-top: 15px; font-size: 0.75em; color: #bbb; display: flex; justify-content: space-between;">
                  <span>Misiones, Argentina</span>
                  <span>Último paso: {{ hoy | date:'HH:mm' }}hs</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    <style>
      .filter-btn { border: none; padding: 12px; text-align: left; border-radius: 8px; cursor: pointer; background: #f8f9fa; color: #555; transition: 0.2s; font-weight: 500; }
      .filter-btn:hover { background: #eef1ef; }
      .filter-btn.active { background: #1b3d17; color: white; }
      .filter-btn.red { color: #e74c3c; }
      .filter-btn.orange { color: #f39c12; }
      .filter-btn.green { color: #27ae60; }
      
      .lote-card { background: white; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: 0.3s; cursor: pointer; border: 2px solid transparent; }
      .lote-card:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
      .lote-card.selected { border: 2px solid #27ae60; background: #fafffa; }

      @keyframes slideIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    </style>
  `
})
export class AppComponent {
  hoy = new Date();
  busqueda = '';
  filtroEstado = 'todos';
  loteSeleccionado: any = null;

  lotes = [
    { id: 1, nombre: 'Cuadro Norte - Cítricos', tipo: 'Cítricos', salud: 0.85 },
    { id: 2, nombre: 'Lote San Pedro - Yerba', tipo: 'Yerba Mate', salud: 0.45 },
    { id: 3, nombre: 'Cuadro Km 12 - Té', tipo: 'Té', salud: 0.15 },
    { id: 4, nombre: 'Parcela Té Superior', tipo: 'Té', salud: 0.72 },
    { id: 5, nombre: 'Lote Este - Cítricos', tipo: 'Cítricos', salud: 0.38 }
  ];

  seleccionarLote(lote: any) {
    this.loteSeleccionado = lote;
  }

  getRecomendacion(salud: number): string {
    if (salud >= 0.7) return "Condiciones óptimas. Se sugiere continuar con el monitoreo de rutina.";
    if (salud >= 0.3) return "Se detecta estrés moderado. Revisar niveles de fertilización y humedad.";
    return "ALERTA CRÍTICA: Se requiere inspección física inmediata por posible presencia de plagas.";
  }

  lotesFiltrados() {
    return this.lotes.filter(l => {
      const coincideBusqueda = l.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) || 
                               l.tipo.toLowerCase().includes(this.busqueda.toLowerCase());
      
      if (this.filtroEstado === 'todos') return coincideBusqueda;
      if (this.filtroEstado === 'critico') return coincideBusqueda && l.salud < 0.3;
      if (this.filtroEstado === 'alerta') return coincideBusqueda && l.salud >= 0.3 && l.salud < 0.7;
      if (this.filtroEstado === 'sano') return coincideBusqueda && l.salud >= 0.7;
      return coincideBusqueda;
    });
  }

  getColor(salud: number) {
    if (salud >= 0.7) return '#27ae60';
    if (salud >= 0.3) return '#f39c12';
    return '#e74c3c';
  }

  calcularPromedio() {
    const sum = this.lotes.reduce((acc, l) => acc + l.salud, 0);
    return Math.round((sum / this.lotes.length) * 100);
  }

  simularClima() {
    this.lotes.forEach(l => {
      l.salud = Math.random();
    });
    this.hoy = new Date();
    this.loteSeleccionado = null;
  }
}

bootstrapApplication(AppComponent);