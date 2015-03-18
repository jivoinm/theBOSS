'use strict';

angular.module('theBossApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }, {
      'title': 'Orders',
      'link': '/order/list'
    }, {
      'title': 'Calendar',
      'link': '/calendar'
    }, {
      'title': 'Services',
      'link': '/order/services'
    }, {
      'title': 'Add Order',
      'link': '/order/detail/'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
