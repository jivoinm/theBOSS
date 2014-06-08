'use strict';

angular.module('theBossApp')
    .controller('OrdersCtrl', ['$scope', 'OrderService','User','FormService', 'toaster', 'CalendarService', function ($scope, OrderService, User, FormService, toaster,  CalendarService) {
        var date = new Date();
        var requiredDate = new Date(new Date().setDate(date.getDate()+21));

        $scope.$parent.pageHeader = 'Orders';
        $scope.order = {date_required: requiredDate};
        $scope.order.uploaded_files = [];
        $scope.isAddressVisible = false;
        $scope.order.forms = [];
        $scope.order_files = [];
        $scope.available_projects = [];
        $scope.order_search_fields = [{query:'customer', label:'Customer', api:'/api/customer'},{query:'created_by', label:'Created By', api:'/api/users'},{query:'projects.fields', label:'Projects'}];
        $scope.order_task_fields = [{title:'Title', type:'text', require: true},{title:'Duration', type:'text', require: true},{title:'Status Options', type:'textarea', require: true}];
        $scope.order_accessories_fields = [{title:'From Manufacturer', type:'text', require: true},{title:'Description', type:'text', require: true}, {title:'Quantity', type:'number', require: true},{title:'Received', type:'checkbox', require: false},{title:'Date Received', type:'date', require: false}];
        $scope.order_service_fields = [{title:'Service Date', type:'date', require: true}, {title:'Details', type:'textarea', require: true},{title:'Done By', type:'text', require: false}];

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
                                $scope.order = {};
                                toaster.pop('success', "Your order was scheduled to be delivered on "+ cal.end);
                            });

                        });
                    }else{
                        $scope.order = {};
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
        $scope.$watchCollection('order.forms',function(){
            var hours = 0;
            if($scope.order && $scope.order.forms){
                $scope.order.forms.forEach(function(form){
                    if(form.tasks){
                        form.tasks.forEach(function(task){
                            hours += +task.duration.replace(/h$/,"");
                        })
                    }
                })
            }
            $scope.order.total_working_hours = hours;
        });


      

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
            var details = 'Due date:'+order.date_required+'<br>';
            details += 'Created by:'+order.created_by.name+'<br>';
            details += 'Files:<br>';
            angular.forEach(order.order_files,function(file){
                details += file.filename + '<br>';
            });
            return details;
        }
        /* add custom event*/
        function calendarDetailFromOrder(order) {
            var requiredDate = new Date(order.date_required);
            var start = new Date(requiredDate.setHours(requiredDate.getHours() - order.total_working_hours));
            return {
                owner: $scope.currentUser.owner,
                title: order.customer.name +' - '+order.created_by.name,
                details: 'http://localhost:9000/order-details/'+order._id,
               // url: '/order/'+order._id,
                start: start,
                end: requiredDate,
                color: 'green',
                allDay: true
            };
        };
    }]);
