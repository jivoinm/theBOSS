'use strict';

angular.module('theBossApp')
    .directive('orderCalendar', ['OrderService', 'toaster', 'ModalService', 'moment', 'theBossSettings', 'roles', '$location',
        function (OrderService, toaster, ModalService, moment, theBossSettings, roles, $location) {
        return {
            templateUrl: '/views/directive-templates/order-calendar.html',
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
                    
                    if(status.toLowerCase() === 'approved'){
                        return 'label label-default';
                    }else if(status.toLowerCase() === 'finished'){
                        return 'label label-success';
                    }else if(status.toLowerCase() === 'in progress'){
                        return 'label label-primary';
                    }else if(status.toLowerCase() === 'installation'){
                        return 'label label-dark';
                    }else if(status.toLowerCase() === 'shipped'){
                        return 'label label-bright';
                    }else if(status.toLowerCase() === 'blocked' ||status.toLowerCase() === 'service'){
                        return 'label label-danger';
                    }else {
                        return 'label label-warning';
                    }
                }

                $scope.eventsF = function (start, end, callback) {
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
                                this.push($scope.createEvent('date_required', order, order._id, ( (order.installation_date ? "(Chg)" : "")+ '['+ order.po_number + '] '+ order.customer.name+ ' '+(order.doors || '')),
                                    order.date_required,$scope.getLabelClass(order.status)));
                                    if(order.services && order.services.length > 0){
                                        angular.forEach(order.services, function(service,i){
                                            events.push($scope.createEvent('services['+i+'].date', service, order._id, ('['+ order.po_number + '] '+ order.customer.name+ ' '+(order.doors || '') + '- Service'),
                                                service.date,$scope.getLabelClass('service')));

                                        });
                                    }
                                    if(order.installation_date){
                                        events.push($scope.createEvent('installation_date', order, order._id, ('['+ order.po_number + '] '+ order.customer.name+ ' '+(order.doors || '') ),
                                                order.installation_date, $scope.getLabelClass('installation')));
                                    } 
                                    if(order.shipped_date){
                                        events.push($scope.createEvent('shipped_date', order, order._id, ('['+ order.po_number + '] '+ order.customer.name+ ' '+(order.doors || '') ),
                                                order.shipped_date, $scope.getLabelClass('shipped')));
                                    }
                            }, events);
                            callback(events);

                        }, function (err){
                            toaster.pop('error', "Error", 'Error loading orders '+ err);
                            console.log(err);
                        });
                };

                $scope.createEvent = function(updateDate, item, orderId, title, start, className){
                    var calendarOrder = {};
                    calendarOrder.order_id = orderId;
                    calendarOrder.title = title;
                    calendarOrder.start = start;
                    calendarOrder.end = start;
                    calendarOrder.className = className;
                    calendarOrder.update_date = updateDate;
                    calendarOrder.item = item;
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
                    calendar: {
                        header: {
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
                    var calendar = {
                        orderId:event.order_id,
                        property: event.update_date,
                        date: moment(event.start).zone(theBossSettings.timeZone).format('YYYY-MM-DD')
                    };
                    OrderService.setDateRequired(calendar);
                }

                $scope.eventSources = [$scope.eventsF];
            }
        };
    }]);
