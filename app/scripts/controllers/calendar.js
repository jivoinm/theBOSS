'use strict';

angular.module('theBossApp')

  .controller('CalendarCtrl',['$scope','CalendarService', 'OrderService', 'ModalService', '$http', function ($scope, CalendarService, OrderService, ModalService, $http) {
        $scope.$parent.pageHeader = 'Calendar';
        $scope.unscheduled_orders = [];
        $scope.events = [];
        $scope.scheduled_orders = [];


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
            var details = event.details;

            //load details from the event details url
            if(details.indexOf('http')>-1){
                $http({method: 'GET', url: details}).success(function(result){
                    ModalService.showOrderDetailsPopup('Event details',result);
                }).error(function(err){
                        ModalService.showPopup('Error loading event details',err);
                    });
            }else{
                ModalService.showPopup('Event details',details);
            }
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

        $scope.yearView = function(){
            var currentView = $scope.myCalendar.fullCalendar('getView');
            ModalService.showPopup('Event details '+currentView.title, '');
        }

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
