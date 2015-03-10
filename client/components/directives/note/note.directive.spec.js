'use strict';

describe('Directive: note', function () {

  // load the directive's module and view
  beforeEach(module('theBossApp'));
  beforeEach(module('components/directives/note/note.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<note></note>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the note directive');
  }));
});