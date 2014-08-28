'use strict';

angular.module('theBossApp')
    .directive('orderCalendar', ['OrderService', 'toaster', 'ModalService', 'moment', 'theBossSettings', 'roles', '$location',
        function (OrderService, toaster, ModalService, moment, theBossSettings, roles, $location) {
        return {
            template: '<div ui-calendar="uiConfig.calendar" calendar="myCalendar" ng-model="eventSources"></div>',
            restrict: 'E',
            scope: {
                orderStatus: '='
            },
            controller: function ($scope) {
                var date = new Date();
                var d = date.getDate();
                var m = date.getMonth();
                var y = date.getFullYear();

                $scope.getLabelClass = function (status){
                    if (!status) {return 'label label-warning';};
                    
                    if(status.toLowerCase() === 'finished'){
                        return 'label label-success';
                    }else if(status.toLowerCase() === 'in progress'){
                        return 'label label-primary';
                    }else if(status.toLowerCase() === 'blocked' ||status.toLowerCase() === 'service'){
                        return 'label label-danger';
                    }else {
                        return 'label label-warning';
                    }
                }

                $scope.eventsF = function (start, end, callback) {
                    console.log($location.search());
                    var query = {};
                    if($location.search()){
                        query = $location.search();
                    }
                    query.status = $scope.orderStatus;
                    query.from = moment(start).zone(theBossSettings.timeZone).format('YYYY-MM-DD');
                    query.to = moment(end).zone(theBossSettings.timeZone).format('YYYY-MM-DD');
                    OrderService.getOrders(query).$promise.
                        then(function (orders){
                            //set order to calendar
                            var events = [];
                            angular.forEach(orders.orders, function (order){
                                this.push($scope.createEvent(order._id, ('['+ order.po_number + '] '+ order.customer.name),
                                    order.date_required,$scope.getLabelClass(order.status)));
                                if(order.services && order.services.length > 0){
                                    angular.forEach(order.services, function(service){
                                        this.push($scope.createEvent(order._id, ('['+ order.po_number + '] '+ order.customer.name + '- Service'),
                                            order.date_required,$scope.getLabelClass('service')));

                                    });
                                }

                            }, events);
                            callback(events);

                        }, function (err){
                            toaster.pop('error', "Error", 'Error loading orders '+ err);
                            console.log(err);
                        });

                };

                $scope.createEvent = function(orderId, title, start, className){
                    var calendarOrder = {};
                    calendarOrder.order_id = orderId;
                    calendarOrder.title = title;
                    calendarOrder.start = start;
                    calendarOrder.end = start;
                    calendarOrder.className = className;
                    return calendarOrder;
                }

                $scope.eventDrop = function (event,dayDelta,minuteDelta,revertFunc) {
                    updateCalendarEvent(event);
                };

                $scope.eventClick = function (event){
                    var details = event.details;
                    OrderService.get({orderId:event.order_id}).$promise.then(function(result){
                        ModalService.showOrderDetailsPopup('Event details',result);
                    }, function(err){
                            ModalService.showPopup('Error loading event details',err);
                        });

                };

                $scope.eventResize = function (event,dayDelta,minuteDelta,revertFunc){
                    updateCalendarEvent(event);
                };


                /* config object */
                $scope.uiConfig = {
                    calendar:{
                        header:{
                            left: 'today prev,next',
                            center: 'title',
                            right: 'month,basicWeek'
                        },
                        editable: roles.validateRoleAdmin($scope.$root.currentUser),
                        eventClick: $scope.eventClick,
                        eventDrop: $scope.eventDrop,
                        eventResize: $scope.eventResize,
                        eventMouseover: $scope.eventMouseover,
                        eventMouseout: $scope.eventMouseout
                    }
                };

                $scope.yearView = function(){
                    var currentView = $scope.myCalendar.fullCalendar('getView');
                    ModalService.showPopup('Event details '+currentView.title, '');
                }

                //update calendar event on server and ui
                function updateCalendarEvent(event) {
                    OrderService.setDateRequired({orderId:event.order_id, date_required: moment(event.start).zone(theBossSettings.timeZone).format('YYYY-MM-DD')});
                }

                $scope.eventSources = [$scope.eventsF];
            }
        };
    }]);
