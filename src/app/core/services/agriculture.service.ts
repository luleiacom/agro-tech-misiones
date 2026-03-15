import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

// Definimos la interfaz aquí mismo para que sea más fácil ahora
export interface Plot {
  id: number;
  name: string;
  cropType: string;
  healthIndex: number;
  status: 'Healthy' | 'Warning' | 'Critical';
}

@Injectable({
  providedIn: 'root'
})
export class AgricultureService {
  private mockData: Plot[] = [
    { id: 1, name: 'Lote Norte - Citrus', cropType: 'Limón', healthIndex: 0.85, status: 'Healthy' },
    { id: 2, name: 'Lote Sur - Yerba', cropType: 'Yerba Mate', healthIndex: 0.45, status: 'Warning' },
    { id: 3, name: 'Sector Este - Té', cropType: 'Té', healthIndex: 0.20, status: 'Critical' }
  ];

  getPlots(): Observable<Plot[]> {
    return of(this.mockData).pipe(delay(1000));
  }
}