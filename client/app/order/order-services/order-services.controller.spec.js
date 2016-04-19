'use strict';

describe('Controller: OrderServicesCtrl', function () {

  // load the controller's module
  beforeEach(module('theBossApp'));

  var OrderServicesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OrderServicesCtrl = $controller('OrderServicesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
