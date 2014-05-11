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

    it("should render bootstrap form group div",function(){
        element = angular.element('<field ng-model="field"></field>');
        scope.field = {
            title: 'Field Title',
            type:'text',
            require: true,
            value:'default value'
        }
        element = $compile(element)(scope);
        scope.$apply();
        expect(element.find('.form-control').length).toBeGreaterThan(0);
    })

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

        it('should render select filed with default value if show options are set', function () {
            element = $compile(element)(scope);
            scope.field.show_options = ['Value1','default value'];
            scope.$apply();

            expect(scope.field.value).toBe('default value');
        });
    });

});
