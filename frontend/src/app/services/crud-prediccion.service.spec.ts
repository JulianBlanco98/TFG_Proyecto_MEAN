import { TestBed } from '@angular/core/testing';

import { CrudPrediccionService } from './crud-prediccion.service';

describe('CrudPrediccionService', () => {
  let service: CrudPrediccionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudPrediccionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
