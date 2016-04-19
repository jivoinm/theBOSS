'use strict';

describe('Directive: alerts', function () {

  // load the directive's module and view
  beforeEach(module('theBossApp'));
  beforeEach(module('../components/directives/alerts/alerts.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<alerts></alerts>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the alerts directive');
  }));
});