'use strict';

describe('Directive: orderServices', function () {

  // load the directive's module and view
  beforeEach(module('theBossApp'));
  beforeEach(module('components/directives/order/order-services/order-services.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<order-services></order-services>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the orderServices directive');
  }));
});