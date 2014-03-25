'use strict';

describe('Directive: sbAdminModule', function () {

    // load the directive's module
    beforeEach(module('theBossApp'));

    var element,
        scope;

    describe("top-nav tests", function () {
        beforeEach(inject(function ($rootScope) {
            scope = $rootScope.$new();
            element = angular.element('<sb-top-nav title="\'theBOSS Admin\'"></sb-top-nav>');
        }));

        it('should render title beside the logo', inject(function ($compile) {
            element = $compile(element)(scope);
            console.log(element.text());
            expect(element.text()).toContain('theBOSS Admin');
        }));

        it("should not show message list if user is not logged in", function () {
        });

    });
});
