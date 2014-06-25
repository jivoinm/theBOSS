'use strict';

describe('Service: CustomerFormService', function () {

  // load the service's module
  beforeEach(module('theBossApp'));

  // instantiate service
  var CustomerFormService;
  beforeEach(inject(function (_CustomerFormService_) {
    CustomerFormService = _CustomerFormService_;
  }));

  it('should do something', function () {
    expect(!!CustomerFormService).toBe(true);
  });

});
