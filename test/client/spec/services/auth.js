'use strict'

describe('Auth services',function(){
    beforeEach(module('theBossApp'));
    var auth,scope,sessionService,cookies;
    var user = {
        email: 'email@email.com',
        password: 'password'
    };

    var cookieStoreMock = jasmine.createSpyObj('cookieStore',['get']);
    cookieStoreMock.cookieStore = "";
    cookieStoreMock.andCallFake.get()
    {
        return user;
    };
    module(function($provide){
        $provide.value('$cookieStore',cookieStoreMock);
    })
    beforeEach(inject(function($rootScope,Auth,Session,$cookieStore){
        scope = $rootScope.$new();
        auth = Auth;
        sessionService = Session;
        cookies = $cookieStore;
    }));

    describe('Log in',function(){
        beforeEach(function(){
            //spyOn(auth,"login").andCallThrough();
            spyOn(sessionService,"save").andCallThrough();
        });

        it('should call save session service', function(){
            auth.login(user,function(){});
            expect(sessionService.save).toHaveBeenCalled();
        });

        it('should return true wen isLoggedIn is called and we have current user in the scope',function(){

            expect(cookies.get).toHaveBeenCalled();
            expect(auth.isLoggedIn()).toBeTruthy();
        });
    });
})