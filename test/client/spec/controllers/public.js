'use strict';

describe('Controller: PublicCtrl', function () {

    // load the controller's module
    beforeEach(module('theBossApp'));

    var PublicCtrl,
        scope,
        $httpBackend;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('/api/awesomeThings')
            .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);
        scope = $rootScope.$new();
        PublicCtrl = $controller('PublicCtrl', {
            $scope: scope
        });
    }));

});
