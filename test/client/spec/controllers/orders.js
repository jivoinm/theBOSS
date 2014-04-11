'use strict';

describe('Controller: OrdersCtrl', function () {

    // load the controller's module
    beforeEach(module('theBossApp'));

    var OrdersCtrl,
        scope,
        $httpBackend,
        orderService;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$httpBackend_, $controller, $rootScope, _OrderService_) {
        $httpBackend = _$httpBackend_;
        scope = $rootScope.$new();
        scope.currentUser = {user_id: 'userid'};
        orderService = _OrderService_;
        spyOn(orderService, 'get');
        OrdersCtrl = $controller('OrdersCtrl', {
            $scope: scope,
            OrderService: orderService
        });
    }));

    it('should attach a list of current user orders to the scope', function () {
        expect(orderService.get).toHaveBeenCalled();
    });


});
