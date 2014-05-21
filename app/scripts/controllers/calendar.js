'use strict';

angular.module('theBossApp')

  .controller('CalendarCtrl',['$scope','CalendarService', 'OrderService', function ($scope, CalendarService, OrderService) {
        $scope.$parent.pageHeader = 'Calendar';
        $scope.unscheduled_orders = [];
        $scope.events = [];
        $scope.scheduled_orders = [];

        OrderService.unscheduledOrders().$promise.then(function (orders){
            $scope.unscheduled_orders = orders;
        }, function (err){

        });

        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();


        $scope.eventsF = function (start, end, callback) {
            CalendarService.getMonthEvents({from: start, to: end}).$promise.
                then(function (events){
                    callback(events);
                }, function (err){
                    console.log(err);
                });

        };

        $scope.eventDrop = function (event,dayDelta,minuteDelta,revertFunc) {
            updateCalendarEvent(event);
        };

        $scope.eventClick = function (event){
            console.log(event);
        };

        $scope.eventResize = function (event,dayDelta,minuteDelta,revertFunc){
            updateCalendarEvent(event);
        };

        $scope.startCallback = function (event){
            console.log(event);
        }


        /* config object */
        $scope.uiConfig = {
            calendar:{
//                header:{
//                    left: 'title',
//                    center: '',
//                    right: 'today prev,next'
//                },
                //height: 450,
                editable: true,
                eventClick: $scope.eventClick,
                eventDrop: $scope.eventDrop,
                eventResize: $scope.eventResize
            }
        };

        $scope.addEvent = function(order, index) {
            var cal = calendarDetailFromOrder(order);
            //remove from list
            $scope.unscheduled_orders.splice(index,1);
            //save to server
            var calendarService = new CalendarService(cal);
            calendarService.$save(function(_cal){
                if(_cal._id){
                    order.$setScheduled({scheduled: true},function(){
                        $scope.events.push(cal);
                    });
                }
            });
        };

        //update calendar event on server and ui
        function updateCalendarEvent(event) {
            event.$update(function (e) {
                event.start = new Date(e.start);
                event.end = e.end ? new Date(e.end) : null;
            });
        }

        //create event color
        function getRandomColor() {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        /* add custom event*/
        function calendarDetailFromOrder(order) {
            var requiredDate = order.date_required ? new Date(order.date_required) : new Date(y,m,d + order.total_working_hours);
            var start = new Date(requiredDate.setDate(requiredDate.getDate() - order.total_working_hours));
            return {
                owner: $scope.currentUser.owner,
                title: order.customer.name,
                details: order.customer.name,
                //url: '/order/',
                start: start,
                end: requiredDate,
                color: getRandomColor()
                //allDay: true
            };
        };

        $scope.eventSources = [$scope.events,$scope.eventsF];
  }]);
