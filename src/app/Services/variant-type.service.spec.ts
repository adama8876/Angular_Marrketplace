import { TestBed } from '@angular/core/testing';

import { VariantTypeService } from './variant-type.service';

describe('VariantTypeService', () => {
  let service: VariantTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VariantTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
