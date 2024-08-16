import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPremioComponent } from './show-premio.component';

describe('ShowPremioComponent', () => {
  let component: ShowPremioComponent;
  let fixture: ComponentFixture<ShowPremioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowPremioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowPremioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
