'use strict';

describe('Directive: formBuilder', function () {

    // load the directive's module
    beforeEach(module('theBossApp'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    it('should accept fields as a list of forms', inject(function ($compile) {
        element = angular.element('<form-builder></form-builder>');
        scope.forms = [{}];
        element = $compile(element)(scope);
        expect(element.text()).toBe('this is the formBuilder directive');
    }));
});
