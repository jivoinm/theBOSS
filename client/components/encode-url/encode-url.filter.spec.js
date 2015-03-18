'use strict';

describe('Filter: encodeUrl', function () {

  // load the filter's module
  beforeEach(module('theBossApp'));

  // initialize a new instance of the filter before each test
  var encodeUrl;
  beforeEach(inject(function ($filter) {
    encodeUrl = $filter('encodeUrl');
  }));

  it('should return the input prefixed with "encodeUrl filter:"', function () {
    var text = 'angularjs';
    expect(encodeUrl(text)).toBe('encodeUrl filter: ' + text);
  });

});
