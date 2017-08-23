import { TestBed, inject } from '@angular/core/testing';

import { FilteraddressService } from './filteraddress.service';

describe('FilteraddressService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilteraddressService]
    });
  });

  it('should be created', inject([FilteraddressService], (service: FilteraddressService) => {
    expect(service).toBeTruthy();
  }));
});
