import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabClasificacionComponent } from './tab-clasificacion.component';

describe('TabClasificacionComponent', () => {
  let component: TabClasificacionComponent;
  let fixture: ComponentFixture<TabClasificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabClasificacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabClasificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
