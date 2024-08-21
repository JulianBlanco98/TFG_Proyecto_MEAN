import { Component, OnInit } from '@angular/core';
import { CrudPrediccionService } from 'src/app/services/crud-prediccion.service';
import { Prediccion } from 'src/app/models/prediccion.model';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css']
})
export class HistoricoComponent implements OnInit{


  isPrediRealizada : boolean = false;
  predicciones: Prediccion[];
  totalMonedasJugadas: number;
  faGanada = faCheckCircle;
  faPerdida = faTimesCircle;

  constructor(
    private readonly crudPrediccionService: CrudPrediccionService
  ) {}

  ngOnInit(): void {
    this.getPrediccionesHechas();
  }

  getPrediccionesHechas() {
    this.crudPrediccionService.getPrediccionesHechas().subscribe({
      next: (data: any) => {
        this.predicciones = data;
        console.log("Predicciones: ",this.predicciones);
        this.isPrediRealizada = true; 
        this.calcularTotalMonedasPorPrediccion();      
      },
      error: (err) => {
        console.log(err.error.message);
        this.isPrediRealizada = false;       
        
      },
    })
  }

  calcularTotalMonedasPorPrediccion() {
    this.predicciones.forEach(prediccion => {
      const totalTipo1 = prediccion.tipo_1.reduce((sum, t1) => sum + t1.cantidad, 0);
      const totalTipo2 = prediccion.tipo_2.reduce((sum, t2) => sum + t2.cantidad, 0);
      const totalTipo3 = prediccion.tipo_3.reduce((sum, t3) => sum + t3.cantidad, 0);
      prediccion['totalMonedas'] = totalTipo1 + totalTipo2 + totalTipo3;
    });
  }

}
