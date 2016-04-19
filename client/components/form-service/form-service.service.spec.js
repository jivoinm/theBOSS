'use strict';

describe('Service: formService', function () {

  // load the service's module
  beforeEach(module('theBossApp'));

  // instantiate service
  var formService;
  beforeEach(inject(function (_formService_) {
    formService = _formService_;
  }));

  it('should do something', function () {
    expect(!!formService).toBe(true);
  });

});
