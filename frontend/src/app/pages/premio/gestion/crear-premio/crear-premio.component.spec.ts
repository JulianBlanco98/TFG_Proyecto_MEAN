import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearPremioComponent } from './crear-premio.component';

describe('CrearPremioComponent', () => {
  let component: CrearPremioComponent;
  let fixture: ComponentFixture<CrearPremioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearPremioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearPremioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
