'use strict';

describe('Directive: adminModule', function () {

  // load the directive's module
  beforeEach(module('theBossApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<admin-module></admin-module>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the adminModule directive');
  }));
});