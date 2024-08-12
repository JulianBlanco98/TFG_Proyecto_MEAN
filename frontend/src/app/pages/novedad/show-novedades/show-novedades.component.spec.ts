import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowNovedadesComponent } from './show-novedades.component';

describe('ShowNovedadesComponent', () => {
  let component: ShowNovedadesComponent;
  let fixture: ComponentFixture<ShowNovedadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowNovedadesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowNovedadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
