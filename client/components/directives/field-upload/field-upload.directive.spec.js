'use strict';

describe('Directive: fieldUpload', function () {

  // load the directive's module and view
  beforeEach(module('theBossApp'));
  beforeEach(module('components/directives/field-upload/field-upload.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<field-upload></field-upload>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the fieldUpload directive');
  }));
});