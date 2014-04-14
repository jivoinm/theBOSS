'use strict';

describe('Service: User', function () {

    // load the service's module
    beforeEach(module('theBossApp'));

    // instantiate service
    var UserService, httpBackend;
    beforeEach(inject(function (_User_, _$httpBackend_) {
        UserService = _User_;
        httpBackend = _$httpBackend_;
    }));

    it("should return users orders when order is called", function () {

        var status = [
            {order: '1'},
            {order: '2'}
        ];
        httpBackend.expectGET('/api/users/user_id/orders').respond(status);
        UserService.orders({id: 'user_id'});
        httpBackend.flush();
    });

});
