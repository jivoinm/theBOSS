'use strict';

describe('Controller: OrdersCtrl', function () {

    // load the controller's module
    beforeEach(module('theBossApp'));

    var scope,
        controller,
        $httpBackend,
        orderService,
        orders;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$httpBackend_, $controller, $rootScope, _OrderService_) {
        $httpBackend = _$httpBackend_;
        scope = $rootScope.$new();
        scope.currentUser = {user_id: 'userid'};
        orderService = _OrderService_;
        controller = $controller;

        $httpBackend.expectGET('/api/orders').respond([]);

        $controller('OrdersCtrl', {
            '$scope': scope,
            OrderService: orderService
        });
        $httpBackend.flush();
    }));

    it('should be able to load new orders', function () {
        $httpBackend.expectGET('/api/orders?status=new').respond([]);
        scope.loadOrders('new');
        $httpBackend.flush();
    });


});
