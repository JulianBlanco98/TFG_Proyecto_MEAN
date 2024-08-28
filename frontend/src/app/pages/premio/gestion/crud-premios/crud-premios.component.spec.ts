import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudPremiosComponent } from './crud-premios.component';

describe('CrudPremiosComponent', () => {
  let component: CrudPremiosComponent;
  let fixture: ComponentFixture<CrudPremiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudPremiosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudPremiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
