import { TestBed } from '@angular/core/testing';

import { CrudEquiposService } from './crud-equipos.service';

describe('CrudEquiposService', () => {
  let service: CrudEquiposService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudEquiposService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
