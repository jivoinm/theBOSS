'use strict';

describe('Filter: getById', function () {

  // load the filter's module
  beforeEach(module('theBossApp'));

  // initialize a new instance of the filter before each test
  var getById;
  beforeEach(inject(function ($filter) {
    getById = $filter('getById');
  }));

  it('should return the input prefixed with "getById filter:"', function () {
    var text = 'angularjs';
    expect(getById(text)).toBe('getById filter: ' + text);
  });

});
