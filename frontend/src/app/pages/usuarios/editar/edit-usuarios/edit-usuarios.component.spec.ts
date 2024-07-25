import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUsuariosComponent } from './edit-usuarios.component';

describe('EditUsuariosComponent', () => {
  let component: EditUsuariosComponent;
  let fixture: ComponentFixture<EditUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditUsuariosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
