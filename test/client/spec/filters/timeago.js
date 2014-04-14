'use strict';

describe('Filter: timeago', function () {

    // load the filter's module
    beforeEach(module('theBossApp'));

    // initialize a new instance of the filter before each test
    var timeago;
    beforeEach(inject(function ($filter) {
        timeago = $filter('timeago');
    }));

    it('should return less than a minute ago when in date now:', function () {
        var text = new Date();
        expect(timeago(text)).toBe('less than a minute ago');
    });

});
