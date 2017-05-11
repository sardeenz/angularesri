import { TestBed, inject } from '@angular/core/testing';

import { ServicerequestService } from './servicerequest.service';

describe('ServicerequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServicerequestService]
    });
  });

  it('should ...', inject([ServicerequestService], (service: ServicerequestService) => {
    expect(service).toBeTruthy();
  }));
});
