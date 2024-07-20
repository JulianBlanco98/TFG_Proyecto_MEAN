import { TestBed } from '@angular/core/testing';

import { GetClasificacionService } from './get-clasificacion.service';

describe('GetClasificacionService', () => {
  let service: GetClasificacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetClasificacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
