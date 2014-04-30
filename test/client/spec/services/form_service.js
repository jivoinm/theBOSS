'use strict';

describe('Service: Form', function () {

  // load the service's module
  beforeEach(module('theBossApp'));

  // instantiate service
  var Form;
  beforeEach(inject(function (_FormService_) {
    Form = _FormService_;
  }));

  it('should do something', function () {
    expect(!!Form).toBe(true);
  });

});
