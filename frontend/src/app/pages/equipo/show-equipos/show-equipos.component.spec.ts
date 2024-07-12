import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowEquiposComponent } from './show-equipos.component';

describe('ShowEquiposComponent', () => {
  let component: ShowEquiposComponent;
  let fixture: ComponentFixture<ShowEquiposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowEquiposComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowEquiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
