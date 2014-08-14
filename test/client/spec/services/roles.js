'use strict';

describe('Service: roles', function () {

  // load the service's module
  beforeEach(module('theBossApp'));

  // instantiate service
  var roles;
  beforeEach(inject(function (_roles_) {
    roles = _roles_;
  }));

  it('should do something', function () {
    expect(!!roles).toBe(true);
  });

});
