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
        $httpBackend.expectGET('/api/users/userid/orders').respond([
            {_id: 1, customer: {name:'customer'}, last_updated_on: new Date(),projects:[{project:'id1'},{project:'id2'}]},
            {_id: 2, customer: {name:'customer'}, last_updated_on: new Date(),projects:[{project:'id1'},{project:'id2'}]}
        ]);
        OrdersCtrl = $controller('OrdersCtrl', {
            $scope: scope,
            OrderService: orderService
        });
    }));

    it('should attach a list of current user orders to the scope', function () {
        scope.$digest();
        $httpBackend.flush();
        expect(scope.list.length).toBe(2);
    });

    it('should load project tasks when loadTasks is called', function(){
        scope.order = {_id:'order_id'};
        $httpBackend.expectGET('/api/orders/order_id/tasks').respond([{task:12}]);
        scope.loadTasks();
        scope.$digest();
        $httpBackend.flush();
        expect(scope.tasks.length).toBe(1);

    })


});
