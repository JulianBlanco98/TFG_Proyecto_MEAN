import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CrudJornadaService } from 'src/app/services/crud-jornada.service';

@Component({
  selector: 'app-show-partido',
  templateUrl: './show-partido.component.html',
  styleUrls: ['./show-partido.component.css']
})
export class ShowPartidoComponent implements OnInit{

  @Input() nJornada: number
  @Input() nPartido: number

  constructor(
    public readonly modal: NgbActiveModal,
    private readonly crudJornadaService: CrudJornadaService
  ) {}

  ngOnInit(): void {
    this.getPartido();
  }

  getPartido(){
    console.log("En el modal jornada: ",this.nJornada, " partido: ", this.nPartido);
    
    this.crudJornadaService.getPartido(this.nJornada, this.nPartido).subscribe({
      next: (data) => {
        console.log(data);
        
      },
      error: (err) => {
        console.log(err);
        
      }
    })
  }

}
