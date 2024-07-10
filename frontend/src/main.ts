import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component'; //Componente general (padre) de la aplicacion


//Punto de partida de la aplicación. primer archivo que se carga

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
