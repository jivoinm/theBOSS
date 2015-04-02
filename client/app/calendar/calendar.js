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
        templateUrl: 'app/calendar/calendar.html',
        controller: 'CalendarCtrl',
        authenticate: true
      });
  });
