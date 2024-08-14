import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {


  reloadRoles = new Subject<any>();

  private monedasActualizadas = new Subject<void>();
  monedasActualizadas$ = this.monedasActualizadas.asObservable();

  constructor() { }

  setNewRoles(data: any) {
    this.reloadRoles.next(data);
  }

  notifyMonedasActualizadas() {
    this.monedasActualizadas.next();
  }

}
