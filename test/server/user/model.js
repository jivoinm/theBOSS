'use strict';

var should = require('should'),
    mongoose = require('mongoose'),
    Owner = mongoose.model('Owner'),
    User = mongoose.model('User');

var user;

describe('User Model', function() {
    before(function(done) {
        user = new User({
            provider: 'local',
            name: 'Fake User',
            email: 'test@test.com',
            password: '12345'
            //owner: new Owner({name: 'Test owner'}).save()
        });

        // Clear users before testing
        User.remove().exec();
        done();
    });

    afterEach(function(done) {
        User.remove().exec();
        done();
    });

    it('should begin with no users', function(done) {
        User.find({}, function(err, users) {
            users.should.have.length(0);
            done();
        });
    });

    it('should fail when saving a duplicate user', function(done) {
        user.save();
        var userDup = new User(user);
        userDup.save(function(err) {
            should.exist(err);
            done();
        });
    });

    it('should fail when saving without an email', function(done) {
        user.email = '';
        user.save(function(err) {
            should.exist(err);
            done();
        });
    });

    it("should authenticate user if password is valid", function() {
        user.authenticate('password').should.be.true;
    });

    it("should not authenticate user if password is invalid", function() {
        user.authenticate('blah').should.not.be.true;
    });

    it("should error if no owner name is set", function (done) {
        delete user.owner;
        user.save(function(err){
            should.exist(err);
            done()
        });
    });
    it("should create new owner if not exists", function (done) {
        var owner = new User({name: 'find owner'}).save();
        user.ownerName = 'find owner';
        user.save(function(err){
            should.not.exist(err);
            should.exist(this.owner._id);
            console.log(this.owner)
            done()
        });
    });

});