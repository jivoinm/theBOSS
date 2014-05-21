'use strict';

describe('Directive: forms', function () {

    // load the directive's module
    beforeEach(module('theBossApp'));

    beforeEach(module('app/views/directive-templates/form/form.html'));
    beforeEach(module('app/views/directive-templates/form/field-setup.html'));

    var template,
        scope,
        $compile,
        $httpBackend,
        $templateCache,
        $controller,
        element;

    var createForm;

    beforeEach(inject(function ($rootScope, _$compile_, _$httpBackend_, _$templateCache_, _$controller_) {
        scope = $rootScope.$new();
        $compile = _$compile_;
        $httpBackend = _$httpBackend_;
        $templateCache = _$templateCache_;
        $controller = _$controller_;

        template = $templateCache.get('app/views/directive-templates/form/form.html');
        $templateCache.put('app/views/directive-templates/form/form.html', template);
        $httpBackend.expectGET('/views/directive-templates/form/form.html').respond(template);

        createForm = function(formName){
            return {
                form_name:formName,
                fields: [
                    {
                        title: 'field1 title',
                        type: 'text',
                        required: true
                    }
                ]

            }
        };

        $httpBackend.expectGET('/api/forms/Projects').respond([createForm('form1')]);
    }));

    beforeEach(function (){
        element = angular.element('<forms module="Projects" list-of-forms="availableForms"></forms>');
        $compile(element)(scope);

        $httpBackend.flush();
        scope.$digest();
    })

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should crate panel with title name', function () {

        expect(element.html()).toContain('Projects');
    });

    it('should show message if no array of forms is set to directive', function () {
        expect(element.html()).toContain('Nothing to show yet');
    });

    it('should load all owners forms for the module set and show in a list', function (){

        expect(element.find('.panel-heading').text()).toContain('Projects');
    });

    it('should show list of links to click to add forms', function (){
        expect(element.find('button').first().text().trim()).toBe('Add new');
        expect(element.find('button').first().next().find('a').length).toBe(1);
        expect(element.find('button').first().next().find('a')[0].text.trim()).toBe('Add form1');
    });

    xit('should show new modal to enter new field when clicked on addField', function (){
        var template1 = $templateCache.get('app/views/directive-templates/form/field-setup.html');
        $templateCache.put('app/views/directive-templates/form/field-setup.html', template1);
        $httpBackend.expectGET('/views/directive-templates/form/field-setup.html').respond('');
        scope.availableForms = [createForm('form1'),createForm('form2')];

        var modalInstance = {                    // Create a mock object using spies
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
                then: jasmine.createSpy('modalInstance.result.then')
            }
        };

        var Ctrl = $controller('FieldEditCtrl', {
            $scope: scope,
            $modalInstance: modalInstance,
            field: function () { return {}; },
            form: function () { return {_id:'form_id'}; },
            module: function () { return {}; },
            FormService: function () { return {}; }
        });
        scope.$digest();

        var addFieldBtn = element.find('button[ng-click="addField(form,$event)"]')[0];
        $(addFieldBtn).click();

        //$httpBackend.flush();
        expect(Ctrl).toBeDefined();
        element.find('#fieldName').val('test');
        element.find('#fieldType').val('text');
        console.log(element);

        $(element.find('#ok')[0]).click();
        $httpBackend.expectPUT('/api/forms/form_id/',{}).respond('');
        $httpBackend.flush();

    });

    describe('add form to module', function (){
        beforeEach(function (){
            var addElement = element.find('a')[0];
            $(addElement).click();
            scope.$digest();
        });

        it('should insert form object when addForm is clicked and render', function(){
            expect(element.find('div[heading=form1]').length).toBe(1);
        });

        it('should render field from the form added', function (){
            expect(element.find('input[name="fieldName"]').length).toBe(1)
        });
    })



});
