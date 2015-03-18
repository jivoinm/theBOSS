'use strict';

describe('Controller: OrderPrintCtrl', function () {

  // load the controller's module
  beforeEach(module('theBossApp'));

  var OrderPrintCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OrderPrintCtrl = $controller('OrderPrintCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
