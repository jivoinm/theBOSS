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
      .state('calendar.section', {
        url: '/:section',
        templateUrl: 'app/calendar/calendar-status.html',
        controller: 'CalendarCtrl',
        authenticate: true
      })
      .state('calendar.status', {
        url: '/:section/:status',
        templateUrl: 'app/calendar/calendar-status.html',
        controller: 'CalendarCtrl',
        authenticate: true
      })
      .state('calendar.service', {
        url: '/:section/:approved/:completed',
        templateUrl: 'app/calendar/calendar-services.html',
        controller: 'CalendarCtrl',
        authenticate: true
      });
  });
