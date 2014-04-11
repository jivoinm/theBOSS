'use strict';

describe('Service: OrderService', function () {

    // load the service's module
    beforeEach(module('theBossApp'));

    // instantiate service
    var OrderService, httpBackend;
    beforeEach(inject(function (_OrderService_, _$httpBackend_) {
        OrderService = _OrderService_;
        httpBackend = _$httpBackend_;
    }));

    describe("when I call getMyOrders", function () {
        it("should call api and return the results as an array", function () {
            var status = [
                {order: '1'},
                {order: '2'}
            ];
            httpBackend.expectGET('/api/orders').respond(status);
            OrderService.get();
            httpBackend.flush();
        });
    });
});
