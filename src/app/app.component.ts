import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./app.css'],
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