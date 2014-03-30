'use strict';
var User, app, mongoose, request, server, should, user, agent;

should   = require("should");
app      = require("../../../server");
mongoose = require("mongoose");
User     = mongoose.model("User");
request  = require("supertest");
agent = request.agent(app)

describe('User', function () {
    before(function(done) {
        user = new User({
            provider: 'local',
            name: 'Fake User',
            email: 'user@user.com',
            password: 'pass11'
        });
        user.save(done)

    });

    describe('Login test', function () {
        it('should redirect to /', function (done) {
            agent
                .post('/api/session')
                .send({email:'user@user.com', password:'pass11'})
                .end(function(err,res){
                    agent.saveCookies(res.res);
                    agent.get('/api/messages')
                        .end(function(err,res){

                        });
                    done();
                });
        })

        after(function(done) {
            User.remove().exec();
            return done();
        });

    })
})