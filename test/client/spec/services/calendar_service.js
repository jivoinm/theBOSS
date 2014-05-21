'use strict';

describe('Service: CalendarService', function () {

    // load the service's module
    beforeEach(module('theBossApp'));

    // instantiate service
    var CalendarService,$httpBackend;
    beforeEach(inject(function (_CalendarService_,_$httpBackend_) {
        CalendarService = _CalendarService_;
        $httpBackend = _$httpBackend_;
    }));

    it('should call default calendar api and should return a promise', function () {
        $httpBackend.expectGET(/api\/calendar/).respond([{title:'title'}]);
        var cal = CalendarService.getMonthEvents({from: new Date(), to: new Date()});
        $httpBackend.flush();
        expect(cal.length).toBe(1);
    });


});
