import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowTablaClasificacionComponent } from './show-tabla-clasificacion.component';

describe('ShowTablaClasificacionComponent', () => {
  let component: ShowTablaClasificacionComponent;
  let fixture: ComponentFixture<ShowTablaClasificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowTablaClasificacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowTablaClasificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
