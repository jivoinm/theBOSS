'use strict';

describe('Directive: workLog', function () {

  // load the directive's module and view
  beforeEach(module('theBossApp'));
  beforeEach(module('components/directives/work-log/work-log.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<work-log></work-log>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the workLog directive');
  }));
});