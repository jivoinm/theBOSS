'use strict';

describe('Service: Alertserv', function () {

  // load the service's module
  beforeEach(module('theBossApp'));

  // instantiate service
  var Alertserv;
  beforeEach(inject(function (_Alertserv_) {
    Alertserv = _Alertserv_;
  }));

  it('should do something', function () {
    expect(!!Alertserv).toBe(true);
  });

});
