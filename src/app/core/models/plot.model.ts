// src/app/core/models/plot.model.ts
export interface Plot {
  id: number;
  name: string;
  cropType: string;
  healthIndex: number; // 0.0 a 1.0 (NDVI)
  status: 'Healthy' | 'Warning' | 'Critical';
  lastInspection: Date;
}