'use strict';

describe('Controller: OrderDetailCtrl', function () {

  // load the controller's module
  beforeEach(module('theBossApp'));

  var OrderDetailCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OrderDetailCtrl = $controller('OrderDetailCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
