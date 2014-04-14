'use strict';

angular.module('theBossApp')
    .controller('MainCtrl', ['$scope', function ($scope) {
        $scope.$parent.pageHeader = 'Dashboard';
    }]);
