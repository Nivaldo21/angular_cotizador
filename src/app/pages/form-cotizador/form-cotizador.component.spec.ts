import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCotizadorComponent } from './form-cotizador.component';

describe('FormCotizadorComponent', () => {
  let component: FormCotizadorComponent;
  let fixture: ComponentFixture<FormCotizadorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormCotizadorComponent]
    });
    fixture = TestBed.createComponent(FormCotizadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
