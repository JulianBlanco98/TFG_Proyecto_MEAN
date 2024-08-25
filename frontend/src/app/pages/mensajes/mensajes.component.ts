import { Component, OnInit } from '@angular/core';
import { MensajesService } from 'src/app/services/mensajes.service';

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.css']
})
export class MensajesComponent implements OnInit{


  hayMensajes: boolean = false;
  constructor(
    private readonly mensajesService: MensajesService
  ) {}

  ngOnInit(): void {
    
  }

  getMensajes() {
    this.mensajesService.getMensajes().subscribe({
      next: (data: any) => {
        console.log(data);
        this.hayMensajes = true;
        
      },
      error: (err) => {
        this.hayMensajes = false;
      },
    })
  }

}
