'use strict';

angular.module('theBossApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('calendar', {
        url: '/calendar',
        templateUrl: 'app/calendar/calendar.html',
        controller: 'CalendarCtrl',
        authenticate: true
      })
      .state('calendar.status', {
        url: '/:status',
        templateUrl: 'app/calendar/calendar-status.html',
        controller: 'CalendarCtrl',
        authenticate: true
      })
      .state('calendar.services', {
        url: '/service/:approved/:completed',
        templateUrl: 'app/calendar/calendar-services.html',
        controller: 'CalendarCtrl',
        authenticate: true
      });
  });
