import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component'; // Importamos el componente de verdad

bootstrapApplication(AppComponent)
  .catch(err => console.error(err));