import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoleadoresComponent } from './goleadores.component';

describe('GoleadoresComponent', () => {
  let component: GoleadoresComponent;
  let fixture: ComponentFixture<GoleadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoleadoresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoleadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
