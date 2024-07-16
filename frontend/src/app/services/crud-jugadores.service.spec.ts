import { TestBed } from '@angular/core/testing';

import { CrudJugadoresService } from './crud-jugadores.service';

describe('CrudJugadoresService', () => {
  let service: CrudJugadoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudJugadoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
