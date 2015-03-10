'use strict';

angular.module('theBossApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('form', {
        url: '/form',
        templateUrl: 'app/form/form.html',
        controller: 'FormCtrl',
        authenticate: true
      });
  });
