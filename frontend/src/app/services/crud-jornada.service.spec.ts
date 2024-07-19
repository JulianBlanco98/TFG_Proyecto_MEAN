import { TestBed } from '@angular/core/testing';

import { CrudJornadaService } from './crud-jornada.service';

describe('CrudJornadaService', () => {
  let service: CrudJornadaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudJornadaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
