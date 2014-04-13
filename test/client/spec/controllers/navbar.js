'use strict';

describe('Controller: NavbarCtrl', function () {

    // load the controller's module
    beforeEach(module('theBossApp'));

    var NavbarCtrl,
        scope,
        $httpBackend,
        auth,
        location;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$httpBackend_, $controller, $rootScope, Auth, $location) {
        scope = $rootScope.$new();
        auth = Auth;
        location = $location;
        NavbarCtrl = $controller('NavbarCtrl', {
            $scope: scope,
            Auth: auth,
            $location: location
        });
    }));

    it('should have a method to check if the path is active', function () {
        var controller = NavbarCtrl;
        location.path('/about');
        expect(location.path()).toBe('/about');
        expect(scope.isActive('/about')).toBe(true);
        expect(scope.isActive('/contact')).toBe(false);
    });

});

