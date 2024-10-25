import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineaAvanceComponent } from './linea-avance.component';

describe('LineaAvanceComponent', () => {
  let component: LineaAvanceComponent;
  let fixture: ComponentFixture<LineaAvanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LineaAvanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineaAvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
