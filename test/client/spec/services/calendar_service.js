'use strict';

describe('Service: CalendarService', function () {

  // load the service's module
  beforeEach(module('theBossApp'));

  // instantiate service
  var CalendarService;
  beforeEach(inject(function (_CalendarService_) {
    CalendarService = _CalendarService_;
  }));

  it('should do something', function () {
    expect(!!CalendarService).toBe(true);
  });

});
