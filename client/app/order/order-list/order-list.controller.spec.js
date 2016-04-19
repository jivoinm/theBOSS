'use strict';

describe('Controller: OrderListCtrl', function () {

  // load the controller's module
  beforeEach(module('theBossApp'));

  var OrderListCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OrderListCtrl = $controller('OrderListCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
