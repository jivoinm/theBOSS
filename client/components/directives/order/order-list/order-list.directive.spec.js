'use strict';

describe('Directive: orderList', function () {

  // load the directive's module and view
  beforeEach(module('theBossApp'));
  beforeEach(module('components/directives/order/order-list/order-list.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<order-list></order-list>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the orderList directive');
  }));
});