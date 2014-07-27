'use strict';

describe('Controller: OrderCtrl', function () {

    // load the controller's module
    beforeEach(module('theBossApp'));

    var OrderCtrl,
        scope,
        orderService,
        alertService,
        modalService,
        $httpBackend;
    var savedOrder = {_id:'12345', id:'12345',owner:'ownerName',customer:{name:'Customer'}, po_number:'PO1234'}
    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$httpBackend_, $controller, $rootScope, OrderService, AlertService, ModalService) {
        $httpBackend = _$httpBackend_;
        scope = $rootScope.$new();
        orderService = OrderService,
        alertService = AlertService;
        modalService = ModalService;
        OrderCtrl = $controller('OrderCtrl', {
            $scope: scope,
            OrderService: orderService,
            AlertService: alertService,
            ModalService: modalService
        });
    }));

    it('should load new order on the scope if there is no id parameter', function () {
        scope.$apply();
        expect(scope.order).not.toBeUndefined();
        expect(scope.$parent.pageHeader).toBe("New Order");
    });

    it('should load order to scope by id when id parameter is available and set pageHeader to parent', inject(function ($controller, $routeParams) {
        var orderId = 123;
        $routeParams.id = orderId;
        OrderCtrl = $controller('OrderCtrl', {
            $scope: scope,
            $routeParams: $routeParams
        });
        $httpBackend.expectGET('/api/orders/'+orderId).respond(savedOrder);
        $httpBackend.flush();
        expect(scope.order.owner).not.toBeUndefined();
        expect(scope.$parent.pageHeader).toBe("Order PO1234 / Customer");
    }));

    it('should save new order', function () {
        $httpBackend.expectPOST('/api/orders').respond({});
        scope.save(true);
        $httpBackend.flush();
    });

    it('should call alert service and set success message on save', function () {
        $httpBackend.expectPOST('/api/orders').respond(savedOrder);
        scope.save(true);
        $httpBackend.flush();
        expect(alertService.getAlerts().length).toBe(1);
        expect(alertService.getAlerts()[0]).toEqual({type: 'success', msg: 'Saved Order PO1234 / Customer'});
    });

    it('should be able to set status to order', function () {
        savedOrder.status = 'approved'
        $httpBackend.expectPOST('/api/orders').respond(savedOrder);
        scope.updateStatus('approved');
        $httpBackend.flush();
        expect(alertService.getAlerts()[0]).toEqual({type: 'success', msg: 'Saved Order PO1234 / Customer with status approved'});
    });

    it('should be able to delete an order', inject(function ($controller) {
        var mockModalService = {
            confirmDelete: function(message, callback){
                callback(true);
            }
        }

        OrderCtrl = $controller('OrderCtrl', {
            $scope: scope,
            ModalService: mockModalService
        });
        scope.order = new orderService(savedOrder);
        $httpBackend.expectDELETE('/api/orders/'+savedOrder._id).respond({message:'order deleted'});
        scope.delete();

        $httpBackend.flush();
        scope.$digest();
    }))

    it('should show confirm delete modal when deleting an order', inject(function ($q) {
        var deferred = $q.defer();
        scope.order = savedOrder;
        spyOn(modalService,'confirmDelete').andReturn(deferred.promise);
        scope.delete();
        deferred.resolve();
        scope.$digest();
        expect(modalService.confirmDelete).toHaveBeenCalled();
    }))

    it('should be able to approve new orders', inject(function ($controller) {
        var mockModalService = {
            confirm: function(message, callback){
                callback(true);
            }
        }

        OrderCtrl = $controller('OrderCtrl', {
            $scope: scope,
            ModalService: mockModalService
        });
        scope.order = new orderService(savedOrder);
        $httpBackend.expectPATCH('/api/orders/'+savedOrder._id+'/status/approved').respond({message:'order deleted'});
        scope.setStatus('approved');

        $httpBackend.flush();
    }));

    it('should be able to approve new orders', inject(function ($controller) {
        var mockModalService = {
            confirm: function(message, callback){
                callback(true);
            }
        }

        OrderCtrl = $controller('OrderCtrl', {
            $scope: scope,
            ModalService: mockModalService
        });
        scope.order = new orderService(savedOrder);
        $httpBackend.expectPATCH('/api/orders/'+savedOrder._id+'/status/approved').respond({message:'order deleted'});
        scope.setStatus('approved');

        $httpBackend.flush();
    }));


});
