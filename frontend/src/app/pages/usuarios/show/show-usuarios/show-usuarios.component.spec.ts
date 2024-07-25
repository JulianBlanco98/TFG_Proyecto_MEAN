import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowUsuariosComponent } from './show-usuarios.component';

describe('ShowUsuariosComponent', () => {
  let component: ShowUsuariosComponent;
  let fixture: ComponentFixture<ShowUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowUsuariosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
