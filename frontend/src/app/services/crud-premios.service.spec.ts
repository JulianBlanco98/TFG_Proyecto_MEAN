import { TestBed } from '@angular/core/testing';

import { CrudPremiosService } from './crud-premios.service';

describe('CrudPremiosService', () => {
  let service: CrudPremiosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudPremiosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
