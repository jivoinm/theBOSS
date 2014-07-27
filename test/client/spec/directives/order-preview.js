'use strict';

describe('Directive: orderPreview', function () {

  // load the directive's module
  beforeEach(module('theBossApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<order-preview></order-preview>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the orderPreview directive');
  }));
});
