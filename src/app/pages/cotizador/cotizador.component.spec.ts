import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizadorComponent } from './cotizador.component';

describe('CotizadorComponent', () => {
  let component: CotizadorComponent;
  let fixture: ComponentFixture<CotizadorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CotizadorComponent]
    });
    fixture = TestBed.createComponent(CotizadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
