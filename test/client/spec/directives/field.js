'use strict';

describe('Directive: field', function () {

    // load the directive's module
    beforeEach(module('theBossApp'));

    var element,
        scope,
        $compile;

    beforeEach(inject(function ($rootScope,_$compile_) {
        scope = $rootScope.$new();
        $compile = _$compile_;
    }));

    describe('Render Text',function(){
        beforeEach(function(){
            element = angular.element('<field ng-model="field"></field>');
            scope.field = {
                title: 'Field Title',
                type:'text',
                require: true,
                value:'default value'
            }
        });

        it('should render text input',function(){
            $compile(element)(scope);
            scope.$apply();
            expect(element.html()).toContain('<input type="text"');
        });

        it('should render text filed with default value', function () {
            element = $compile(element)(scope);
            scope.$apply();
            expect(element.html()).toContain('default value');
        });
    });

    describe('Render Select',function(){
        beforeEach(function(){
            element = angular.element('<field ng-model="field"></field>');
            scope.field = {
                title: 'Field Title',
                type:'select',
                require: true,
                value:'default value'
            }
        });

        it('should render select input',function(){
            $compile(element)(scope);
            scope.$apply();
            expect(element.html()).toContain('<select');
        });

        it('should render select filed with default value', function () {
            element = $compile(element)(scope);
            scope.$apply();
            console.log(element.html());
            expect(element.find('#FieldTitle').val()).toContain('default value');
        });
    });

});
