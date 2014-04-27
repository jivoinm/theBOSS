'use strict';

describe('Service: Form', function () {

  // load the service's module
  beforeEach(module('theBossApp'));

  // instantiate service
  var Form;
  beforeEach(inject(function (_Form_) {
    Form = _Form_;
  }));

  it('should do something', function () {
    expect(!!Form).toBe(true);
  });

});
