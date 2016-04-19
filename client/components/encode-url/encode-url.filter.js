'use strict';

angular.module('theBossApp')
  .filter('encodeUrl', function () {
    return window.encodeURIComponent;
  });
