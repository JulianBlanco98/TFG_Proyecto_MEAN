import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {


  reloadRoles = new Subject<any>();

  constructor() { }

  setNewRoles(data: any) {
    this.reloadRoles.next(data);
  }

}
