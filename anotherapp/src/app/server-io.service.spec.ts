import { TestBed } from '@angular/core/testing';

import { ServerIoService } from './server-io.service';

describe('ServerIoService', () => {
  let service: ServerIoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerIoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
