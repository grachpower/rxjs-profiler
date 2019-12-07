import { TestBed } from '@angular/core/testing';

import { ExtensionConnectService } from './extension-connect.service';

describe('ExtensionConnectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExtensionConnectService = TestBed.get(ExtensionConnectService);
    expect(service).toBeTruthy();
  });
});
