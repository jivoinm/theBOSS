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
                header:{
                    left: 'today prev,next',
                    center: 'title',
                    right: 'month,basicWeek,basicDay'
                },
                editable: true,
                eventClick: $scope.eventClick,
                eventDrop: $scope.eventDrop,
                eventResize: $scope.eventResize
            }
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



        $scope.eventSources = [$scope.events,$scope.eventsF];
  }]);
