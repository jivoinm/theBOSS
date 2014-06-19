'use strict';

angular.module('theBossApp')
    .controller('OrdersCtrl', ['$scope', 'OrderService','User','FormService', 'toaster', 'CalendarService', '$location', function ($scope, OrderService, User, FormService, toaster, CalendarService, $location) {
        var date = new Date();
        var requiredDate = new Date(new Date().setDate(date.getDate()+21));

        $scope.$parent.pageHeader = 'Orders';
        $scope.order = {date_required: requiredDate};
        $scope.order.uploaded_files = [];
        $scope.isAddressVisible = false;
        $scope.order.forms = [];
        $scope.order_files = [];
        $scope.available_projects = [];

        function QueryOrders(query) {
            OrderService.query(query, function (res) {
                //pushOrderToList(res);
                $scope.list = res;
            })
        }

        $scope.search = function(filter){
            $scope.list = [];
            var query = {query: filter.query};
            if(filter.itemId){
                query.text = filter.itemId;
            }else{
                query.textLike = filter.text;
            }
            QueryOrders(query);

        }

        function loadLatestOrders(){
            $scope.list = [];
            QueryOrders();
        }


        $scope.edit = function (order) {
            //load order
            $scope.selectedFiles = [];
            $scope.order = order;
            toaster.pop('success', "You loaded order #"+ order.po_number);
        }

        $scope.saveOrder = function(form){
            $scope.submitted = true;
            if (form.$valid) {
                var isNewOrder = false;
                if(!$scope.order._id){
                    $scope.order = new OrderService($scope.order);
                    isNewOrder = true;
                }

                $scope.order.$save({orderId:$scope.order._id},function(orderSaved){
                    $scope.submitted = false;
                    loadLatestOrders();
                    if(orderSaved && !orderSaved.scheduled){
                        $scope.addEvent(orderSaved,function(cal){

                            new OrderService.setScheduled({
                                id:orderSaved._id,
                                scheduled:true
                            },function(){
                                $scope.reset();
                                toaster.pop('success', "Your order was scheduled to be delivered on "+ cal.end);
                            });

                        });
                    }else{
                        $scope.reset();
                    }
                    toaster.pop('success', !isNewOrder ? "Existing Order was updated":"New order was created with success");
                },function(){
                    toaster.pop('error', "Error saving the order");
                });
            }
        }

        $scope.reset = function(){
            $scope.order = {};
            $scope.submitted = false;
            $scope.order.date_required = new Date(new Date().setDate(date.getDate()+21));
        }

        $scope.addProject = function(form){
            $scope.order.forms = $scope.order.forms || []
            $scope.order.forms.push({
                form_name: form.name,
                fields: form.fields,
                tasks: form.tasks
            });
        }

        loadLatestOrders();

        $scope.addEvent = function(order, updateOrderAsScheduled) {
            var cal = calendarDetailFromOrder(order);
            //save to server
            var calendarService = new CalendarService(cal);
            calendarService.$save(function(_cal){
                if(_cal._id){
                    updateOrderAsScheduled(_cal);
                }
            });
        };

        function getOrderDetails(order){
            var url = $location.protocol() + ':\\\\' + $location.host();
            if($location.port() != 80){
                url += ':'+ $location.port();
            }
            return  url + '/api/orders/'+order._id;
        }
        /* add custom event*/
        function calendarDetailFromOrder(order) {
            var requiredDate = new Date(order.date_required);
            var start = new Date(requiredDate.setHours(requiredDate.getHours() - order.total_working_hours));
            return {
                owner: $scope.currentUser.owner,
                title: order.po_number +'-'+ order.customer.name +' - '+order.created_by.name,
                details: getOrderDetails(order),
                start: start,
                end: requiredDate,
                color: 'green',
                allDay: true
            };
        };
    }]);
