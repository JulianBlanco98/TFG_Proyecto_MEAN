import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPartidoComponent } from './show-partido.component';

describe('ShowPartidoComponent', () => {
  let component: ShowPartidoComponent;
  let fixture: ComponentFixture<ShowPartidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowPartidoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowPartidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
