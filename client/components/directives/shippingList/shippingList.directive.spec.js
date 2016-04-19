'use strict';

describe('Directive: shippingList', function () {

  // load the directive's module and view
  beforeEach(module('theBossApp'));
  beforeEach(module('components/directives/shippingList/shippingList.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<shipping-list></shipping-list>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the shippingList directive');
  }));
});