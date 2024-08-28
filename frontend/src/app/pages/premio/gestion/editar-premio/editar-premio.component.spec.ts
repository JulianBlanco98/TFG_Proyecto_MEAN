import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPremioComponent } from './editar-premio.component';

describe('EditarPremioComponent', () => {
  let component: EditarPremioComponent;
  let fixture: ComponentFixture<EditarPremioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarPremioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarPremioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
