'use strict';

describe('Service: timeOff', function () {

  // load the service's module
  beforeEach(module('theBossApp'));

  // instantiate service
  var timeOff;
  beforeEach(inject(function (_timeOff_) {
    timeOff = _timeOff_;
  }));

  it('should do something', function () {
    expect(!!timeOff).toBe(true);
  });

});
