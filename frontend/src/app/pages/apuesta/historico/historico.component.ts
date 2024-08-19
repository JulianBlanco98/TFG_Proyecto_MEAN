import { Component, OnInit } from '@angular/core';
import { CrudPrediccionService } from 'src/app/services/crud-prediccion.service';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css']
})
export class HistoricoComponent implements OnInit{


  isPrediRealizada : boolean = false;

  constructor(
    private readonly crudPrediccionService: CrudPrediccionService
  ) {}

  ngOnInit(): void {
    this.getPrediccionesHechas();
  }

  getPrediccionesHechas() {
    this.crudPrediccionService.getPrediccionesHechas().subscribe({
      next: (data: any) => {
        console.log(data);
        this.isPrediRealizada = true;       
      },
      error: (err) => {
        console.log(err.error.message);
        this.isPrediRealizada = false;       
        
      },
    })
  }

}
