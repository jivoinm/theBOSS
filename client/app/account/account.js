'use strict';

angular.module('theBossApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginCtrl'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl'
      })
      .state('users', {
        url: '/user',
        templateUrl: 'app/account/user/user.html',
        controller: 'UserCtrl'
      })
      .state('usersByRole', {
        url: '/user/:role',
        templateUrl: 'app/account/user/user.html',
        controller: 'UserCtrl'
      })
      .state('usersByGroup', {
        url: '/user/group/:group',
        templateUrl: 'app/account/user/user.html',
        controller: 'UserCtrl'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsCtrl',
        authenticate: true
      });
  });
