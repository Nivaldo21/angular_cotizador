import { TestBed } from '@angular/core/testing';

import { CalculosCotizacionService } from './calculos-cotizacion.service';

describe('CalculosCotizacionService', () => {
  let service: CalculosCotizacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculosCotizacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
