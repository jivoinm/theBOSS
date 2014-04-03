'use strict'

describe('Auth services', function () {
    beforeEach(module('theBossApp'));
    var auth, scope, sessionService, cookies, userService;
    var user = {
        email: 'email@email.com',
        password: 'password'
    };

    var cookieStoreMock = jasmine.createSpyObj('cookieStore', ['get']);
    cookieStoreMock.cookieStore = "";
    cookieStoreMock.get()
    {
        return user;
    }
    ;
    module(function ($provide) {
        $provide.value('$cookieStore', cookieStoreMock);
    })
    beforeEach(inject(function ($rootScope, Auth, Session, User, $cookieStore) {
        scope = $rootScope.$new();
        auth = Auth;
        sessionService = Session;
        cookies = $cookieStore;
        userService = User;
    }));

    beforeEach(function () {
        spyOn(sessionService, "save").andCallThrough();
    });

    it('should call save session service', function () {
        auth.login(user, function () {
        });
        expect(sessionService.save).toHaveBeenCalled();
    });

    it('should return true wen isLoggedIn is called and we have current user in the scope', function () {
        expect(cookies.get).toHaveBeenCalled();
        expect(auth.isLoggedIn()).toBeTruthy();
    });
    it("should be able to get current user from the server", function () {
        spyOn(sessionService, 'get').andCallThrough();
        expect(auth.currentUser()).toBe(user);
    });
})