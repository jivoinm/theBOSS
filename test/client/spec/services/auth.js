'use strict'

describe('Auth services',function(){
    beforeEach(module('theBossApp'));
    var auth,scope,sessionService;
    var user = {
        email: 'email@email.com',
        password: 'password'
    };

    beforeEach(inject(function($rootScope,Auth,Session){
        scope = $rootScope.$new();
        auth = Auth;
        sessionService = Session;
    }));

    describe('Log in',function(){
        beforeEach(function(){
            spyOn(sessionService,"save");
            auth.login(user,function(){
                console.log('after log in');
            });
        });

        it('should call save session service', function(){
            expect(sessionService.save).toHaveBeenCalledWith(user);
        });

        it('should return true wen isLoggedIn is called and we have current user in the scope',function(){
            scope.currentUser = {name:'name'};
            expect(auth.isLoggedIn()).toBeTruthy();
        });
    });
})