'use strict';

describe('Directive: orderNotes', function () {

  // load the directive's module and view
  beforeEach(module('theBossApp'));
  beforeEach(module('components/directives/order/order-notes/order-notes.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<order-notes></order-notes>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the orderNotes directive');
  }));
});