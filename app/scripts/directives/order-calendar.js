'use strict';

angular.module('theBossApp')
    .directive('orderCalendar', ['OrderService', 'toaster', 'ModalService', 'moment', 'theBossSettings', 'roles', 
        function (OrderService, toaster, ModalService, moment, theBossSettings, roles) {
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
                    if (!status) {return 'label label-default';};
                    
                    if(status.toLowerCase() === 'finished'){
                        return 'label label-success';
                    }else if(status.toLowerCase() === 'in progress'){
                        return 'label label-primary';
                    }else if(status.toLowerCase() === 'blocked'){
                        return 'label label-warning';
                    }else {
                        return 'label label-default';
                    }
                }

                $scope.eventsF = function (start, end, callback) {

                    OrderService.getOrders({status: $scope.orderStatus, from: moment(start).zone(theBossSettings.timeZone).format('YYYY-MM-DD'), to: moment(end).zone(theBossSettings.timeZone).format('YYYY-MM-DD')}).$promise.
                        then(function (orders){
                            //set order to calendar
                            var events = [];
                            angular.forEach(orders.orders, function (order){
                                var calendarOrder = {};
                                calendarOrder.order_id = order._id;
                                calendarOrder.title = '['+ order.po_number + '] '+ order.customer.name;
                                calendarOrder.start = order.date_required;
                                calendarOrder.end = order.date_required;
                                calendarOrder.className = $scope.getLabelClass(order.status);
                                this.push(calendarOrder);

                            }, events);
                            callback(events);

                        }, function (err){
                            toaster.pop('error', "Error", 'Error loading orders '+ err);
                            console.log(err);
                        });

                };

                

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
                        editable: roles.validateRoleAdmin($scope.currentUser),
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
