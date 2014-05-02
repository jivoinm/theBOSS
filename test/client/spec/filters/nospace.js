'use strict';

describe('Filter: nospace', function () {

  // load the filter's module
  beforeEach(module('theBossApp'));

  // initialize a new instance of the filter before each test
  var nospace;
  beforeEach(inject(function ($filter) {
    nospace = $filter('nospace');
  }));

  it('should return the value with no space', function () {
    var text = 'angularjs with space';
    expect(nospace(text)).toBe('angularjswithspace');
  });

});
