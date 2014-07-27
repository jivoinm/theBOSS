'use strict';

describe('Directive: orderDetails', function () {

    // load the directive's module
    beforeEach(module('theBossApp'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    it('should show an error message when no forms attribute is set', inject(function ($compile) {
        element = angular.element('<order-details></order-details>');
        element = $compile(element)(scope);
        expect(element.text()).toBe('Missing forms attribute');
    }));
});
