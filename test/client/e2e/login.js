'use strict'
describe('theBOSS app test', function () {

    browser.get('index.html');

    it("should show login page", function () {
        expect(browser.getLocationAbsUrl()).toMatch("/");
    });
});