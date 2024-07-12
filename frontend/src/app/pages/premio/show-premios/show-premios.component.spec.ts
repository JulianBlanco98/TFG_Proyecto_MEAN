import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPremiosComponent } from './show-premios.component';

describe('ShowPremiosComponent', () => {
  let component: ShowPremiosComponent;
  let fixture: ComponentFixture<ShowPremiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowPremiosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowPremiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
