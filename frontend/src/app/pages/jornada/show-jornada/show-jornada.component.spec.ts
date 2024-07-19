import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowJornadaComponent } from './show-jornada.component';

describe('ShowJornadaComponent', () => {
  let component: ShowJornadaComponent;
  let fixture: ComponentFixture<ShowJornadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowJornadaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowJornadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
