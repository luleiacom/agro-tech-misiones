import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard-container">
      
      <nav class="navbar">
        <div class="logo-section">
          <div class="logo-icon">🛰️</div>
          <h1>AGRO-TECH <span>MISIONES</span></h1>
        </div>
        <div class="user-info">
          <strong>Lucía Iacono</strong>
          <span>Teledetección</span>
        </div>
      </nav>

      <div class="main-layout">
        
        <aside class="sidebar">
          <div class="card filters">
            <h4>FILTROS RÁPIDOS</h4>
            <div class="filter-group">
              <button (click)="filtroEstado = 'todos'" [class.active]="filtroEstado === 'todos'" class="filter-btn">Todos</button>
              <button (click)="filtroEstado = 'critico'" [class.active]="filtroEstado === 'critico'" class="filter-btn red">⚠️ Críticos</button>
              <button (click)="filtroEstado = 'alerta'" [class.active]="filtroEstado === 'alerta'" class="filter-btn orange">⚡ Alerta</button>
              <button (click)="filtroEstado = 'sano'" [class.active]="filtroEstado === 'sano'" class="filter-btn green">✅ Sanos</button>
            </div>
          </div>

          <div class="card status-card">
            <p>PROMEDIO REGIONAL</p>
            <h2>{{ calcularPromedio() }}%</h2>
            <button (click)="simularClima()" class="action-btn">REESCANEAR ZONA</button>
          </div>
        </aside>

        <main class="content">
          <div class="search-bar">
            <input [(ngModel)]="busqueda" placeholder="Buscar por nombre de lote o cultivo...">
          </div>

          <div class="grid-lotes">
            <div *ngFor="let lote of lotesFiltrados()" 
                 (click)="seleccionarLote(lote)"
                 class="lote-card"
                 [class.selected]="loteSeleccionado === lote"
                 [style.border-top]="'6px solid ' + getColor(lote.salud)">
              
              <div class="lote-header">
                <h3>{{ lote.nombre }}</h3>
                <span class="badge" [style.background]="getColor(lote.salud)">
                  {{ lote.salud * 100 | number:'1.0-0' }}%
                </span>
              </div>
              <small>{{ lote.tipo }}</small>

              <div class="progress-container">
                <div class="progress-bar" [style.width.%]="lote.salud * 100" [style.background]="getColor(lote.salud)"></div>
              </div>

              <div class="stats-mini">
                <div><strong>HUM</strong> 42%</div>
                <div><strong>NDVI</strong> {{ (lote.salud * 0.9).toFixed(2) }}</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    <style>
      /* RESET GENERAL */
      * { box-sizing: border-box; }

      .dashboard-container { 
        font-family: 'Inter', sans-serif; 
        background: #f0f2f0; 
        min-height: 100vh;
        width: 100%;
        overflow-x: hidden; /* Evita el movimiento lateral en iPhone */
      }
      
      .navbar { 
        background: #0d260a; color: white; padding: 15px 20px; 
        display: flex; justify-content: space-between; align-items: center;
        border-bottom: 4px solid #27ae60;
      }
      .logo-section { display: flex; align-items: center; gap: 10px; }
      .navbar h1 { font-size: 1.1rem; margin: 0; }
      .navbar span { color: #27ae60; }

      /* DISEÑO PARA CELULAR */
      .main-layout { 
        display: flex; 
        padding: 15px; 
        gap: 20px; 
        flex-direction: column; /* Uno abajo del otro */
        width: 100%;
      }

      .sidebar { width: 100%; }

      .search-bar input { 
        width: 100%; 
        padding: 15px; 
        border-radius: 12px; 
        border: 1px solid #ddd; 
        margin-bottom: 25px; 
        font-size: 16px; /* Evita el zoom automático del celu */
        box-sizing: border-box; 
      }

      .grid-lotes { display: grid; grid-template-columns: 1fr; gap: 20px; }

      /* DISEÑO PARA PC (Más de 768px) */
      @media (min-width: 768px) {
        .main-layout { flex-direction: row; max-width: 1400px; margin: 0 auto; }
        .sidebar { width: 300px; flex-shrink: 0; }
        .navbar h1 { font-size: 1.5rem; }
        .grid-lotes { grid-template-columns: repeat(2, 1fr); }
      }

      @media (min-width: 1100px) {
        .grid-lotes { grid-template-columns: repeat(3, 1fr); }
      }

      /* TARJETAS Y COMPONENTES */
      .card { background: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 20px; }
      .filter-group { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      @media (min-width: 768px) { .filter-group { display: flex; flex-direction: column; } }

      .filter-btn { border: none; padding: 10px; border-radius: 8px; background: #f8f9fa; cursor: pointer; font-weight: 500; }
      .filter-btn.active { background: #1b3d17; color: white; }

      .lote-card { background: white; padding: 20px; border-radius: 12px; cursor: pointer; transition: transform 0.2s; }
      .badge { color: white; padding: 3px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; }

      .progress-container { background: #eee; height: 10px; border-radius: 5px; margin: 15px 0; overflow: hidden; }
      .progress-bar { height: 100%; transition: width 0.5s ease; }
      .stats-mini { display: flex; justify-content: space-between; font-size: 0.8rem; color: #666; }

      .status-card { background: #1b3d17; color: white; text-align: center; }
      .action-btn { background: #27ae60; color: white; border: none; width: 100%; padding: 12px; border-radius: 10px; font-weight: bold; cursor: pointer; margin-top: 10px; }
    </style>
  `
})
export class AppComponent {
  busqueda: string = '';
  filtroEstado: string = 'todos';
  loteSeleccionado: any = null;

  lotes = [
    { id: 1, nombre: 'Cuadro Norte - Cítricos', tipo: 'Cítricos', salud: 0.85 },
    { id: 2, nombre: 'Lote San Pedro - Yerba', tipo: 'Yerba Mate', salud: 0.45 },
    { id: 3, nombre: 'Cuadro Sur - Té', tipo: 'Té', salud: 0.15 },
    { id: 4, nombre: 'Parcela Té Superior', tipo: 'Té', salud: 0.72 },
    { id: 5, nombre: 'Lote Este - Cítricos', tipo: 'Cítricos', salud: 0.38 }
  ];

  seleccionarLote(lote: any) { this.loteSeleccionado = lote; }
  
  calcularPromedio() {
    const sum = this.lotes.reduce((acc, l) => acc + l.salud, 0);
    return Math.round((sum / this.lotes.length) * 100);
  }

  simularClima() {
    this.lotes.forEach(l => l.salud = Math.random());
    this.loteSeleccionado = null;
  }

  lotesFiltrados() {
    return this.lotes.filter(l => {
      const match = l.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) || 
                    l.tipo.toLowerCase().includes(this.busqueda.toLowerCase());
      if (this.filtroEstado === 'todos') return match;
      if (this.filtroEstado === 'critico') return match && l.salud < 0.3;
      if (this.filtroEstado === 'alerta') return match && l.salud >= 0.3 && l.salud < 0.7;
      return match && l.salud >= 0.7;
    });
  }

  getColor(salud: number) {
    if (salud >= 0.7) return '#27ae60';
    if (salud >= 0.3) return '#f39c12';
    return '#e74c3c';
  }
}