'use strict';

describe('Controller: LoginCtrl', function () {

    // load the controller's module
    beforeEach(module('theBossApp'));

    var LoginCtrl,
        scope,
        httpBackend,
        auth,
        location;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$httpBackend_, $controller, $rootScope,Auth, $location) {
        httpBackend = _$httpBackend_;
        scope = $rootScope.$new();
        auth = Auth;
        location = $location;
        LoginCtrl = $controller('LoginCtrl', {
            $scope: scope,
            Auth:auth,
            $location:location
        });


    }));

    it('should redirect to main path after successfully logged in ', function() {
        var user = {
            "name": "Test User",
            "role": "user",
            "provider": "local"
            };
        httpBackend.expectPOST('/api/session').respond(user);

        scope.login({$valid:true});
        httpBackend.flush();
        expect(location.path()).toBe('/');
    });

    it("should have current user on the rootScope set after successful login", function () {
        var user = {
            "name": "Test User",
            "role": "user",
            "provider": "local"
        };
        httpBackend.expectPOST('/api/session').respond(user);

        scope.login({$valid:true});
        httpBackend.flush();
        expect(scope.currentUser).toNotBe(null);
    });

    it('should put error message on the scope for invalid credentials', function() {
        var resp = {
            "message":"Email returned by api"
        };
        httpBackend.expectPOST('/api/session').respond(401,resp);

        scope.login({$valid:true});
        httpBackend.flush();
        expect(location.path()).toBe('/login');
        expect(scope.errors.other).toBe(resp.message);
    });


});

