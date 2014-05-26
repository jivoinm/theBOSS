'use strict';

describe('Controller: OrdersCtrl', function () {

    // load the controller's module
    beforeEach(module('theBossApp'));

    var
        scope,
        $httpBackend,
        orderService,
        userService,
        formService;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$httpBackend_, $controller, $rootScope, _OrderService_,_User_,_FormService_) {
        $httpBackend = _$httpBackend_;
        scope = $rootScope.$new();
        scope.currentUser = {user_id: 'userid'};
        orderService = _OrderService_;
        userService = _User_;
        formService = _FormService_;


        $httpBackend.expectGET('/api/orders').respond([
            {_id: 1, customer: {name:'customer'}, last_updated_on: new Date(),projects:[{project:'id1'},{project:'id2'}]},
            {_id: 2, customer: {name:'customer'}, last_updated_on: new Date(),projects:[{project:'id1'},{project:'id2'}]}
        ]);


        $controller('OrdersCtrl', {
            '$scope': scope,
            OrderService: orderService,
            User:userService,
            FormService:formService
        });
        $httpBackend.flush();
    }));

    it("should have user object on the scope on initial load", function(){
        expect(scope.order).toBeDefined();
    })

    it('should load owner available projects to be available on the scope',function(){
        expect(scope.list.length).toBe(2);
    })


    it("should post order update request on saveOrder", function(){
        scope.order = new orderService({_id:'order_id', customer:{name:'Customer Name'},projects:[{
            project: 'Test Project',
            field_set:[{
                fields:{

                    value:'Field value1'
                }
            }]

        }]});

        $httpBackend.expectPOST('/api/orders/order_id').respond({_id:'new order ID'});
        $httpBackend.expectGET('/api/orders').respond([]);
        scope.saveOrder({$valid:true});
        $httpBackend.flush();
        expect(scope.order.customer).toBeUndefined();
    })

});
