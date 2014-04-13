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

    it("should return all orders array when query is called", function () {
        var status = [
            {order: '1'},
            {order: '2'}
        ];
        httpBackend.expectGET('/api/orders').respond(status);
        OrderService.query();
        httpBackend.flush();
    });

    it("should return one order when get is called", function () {
        httpBackend.expectGET('/api/orders?id=order_id').respond({});
        OrderService.get({id: 'order_id'});
        httpBackend.flush();
    });

    it("should call put on api order when save is called on an object", function () {
        var order = {id: 'order_id', owner: 'ownerName',
            customer: 'customer',
            projects: [
                {Project: '1'},
                {Project: '2'}
            ],
            created_by: 'createdBy'};
        var Order = new OrderService(order);

        httpBackend.expectPOST('/api/orders/order_id', order).respond({});
        Order.$save();
        httpBackend.flush();
    });

    it("should call delete on api order when delete is called on an object", function () {
        var order = {id: 'order_id', owner: 'ownerName',
            customer: 'customer',
            projects: [
                {Project: '1'},
                {Project: '2'}
            ],
            created_by: 'createdBy'};
        var Order = new OrderService(order);

        httpBackend.expectDELETE('/api/orders/order_id').respond({});
        Order.$delete();
        httpBackend.flush();
    });
});
