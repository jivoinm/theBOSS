'use strict';

describe('Service: Message', function () {

    // load the service's module
    beforeEach(module('theBossApp'));

    // instantiate service
    var Message, httpBackend;
    beforeEach(inject(function (_Message_, _$httpBackend_) {
        Message = _Message_;
        httpBackend = _$httpBackend_
    }));

    it('should do return messages from server', function () {
        httpBackend.expectGET('/api/messages/email@email.com').respond({messages: [
            {type: 'info', read: false, from: 'John Doe', content: 'message1', time: new Date()},
            {type: 'info', read: false, from: 'John Doe', content: 'message2', time: new Date()}
        ]});

        var messages = Message.get({userName: 'email@email.com'});
        httpBackend.flush();
        expect(messages.messages.length).toBe(2);
    });

});
