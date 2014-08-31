'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    passport = require('passport');

/**
 * Create user
 */
exports.create = function (req, res, next) {
    var newUser = new User(req.body);
    newUser.provider = 'local';
    newUser.save(function (err) {
        if (err) return res.json(400, err);

        req.logIn(newUser, function (err) {
            if (err) return next(err);

            return res.json(req.user.userInfo);
        });
    });
};

exports.updateRole = function (req, res, next) {
    User.update({ _id: req.params.id, owner: req.user.owner},
        {$set: {role: req.params.role}},
        function (err){
            if(err) res.json(400,err);
            User.findById(req.params.id, function (err, user){
                if (err) return res.json(400, err);
                return res.send(user);
            })
        });
};

exports.query = function (req, res, next){
    var query = {owner: req.user.owner};
    if(req.query.role){
        query.role = req.query.role;
    }

    if(req.query.text){
        var queryText = new RegExp(req.query.text,"i");
        query.name = queryText;
    }

    User.find(query, null,{sort:{name:1}}, function(err, users){
        if (err) return res.send(400);
        return res.send(users);
    });
}

/**
 *  Get profile of specified user
 */
exports.show = function (req, res, next) {
    var userId = req.params.id;

    User.findById(userId, function (err, user) {
        if (err) return next(err);
        if (!user) return res.send(404);

        res.send({ profile: user.profile });
    });
};

/**
 * Change password
 */
exports.changePassword = function (req, res, next) {
    var userId = req.user._id;
    var oldPass = String(req.body.oldPassword);
    var newPass = String(req.body.newPassword);

    User.findById(userId, function (err, user) {
        if (user.authenticate(oldPass)) {
            user.password = newPass;
            user.save(function (err) {
                if (err) return res.send(400);
                return res.send(200);
            });
        } else {
            return res.send(403);
        }
    });
};

/**
 * Logout
 */
exports.logout = function (req, res) {
    req.logout();
    res.send(200);
};

/**
 * Login
 */
exports.login = function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        var error = err || info;
        if (error) return res.json(401, error);

        req.logIn(user, function (err) {
            if (err) return res.send(err);
            res.json(req.user.userInfo);
        });
    })(req, res, next);
};

exports.queryByName = function (req, res){
    User.find({
        owner: req.user.owner,
        name: new RegExp('^'+req.query.name,'i')
    }, function(err, users){
        if(err) res.json(400,err);
        return res.send(users);
    })
}

/**
 * Get current user
 */
exports.me = function (req, res) {
    res.json(req.user || null);
};

//// User API
//var _ =               require('underscore')
//    , passport =        require('passport')
//    , LocalStrategy =   require('passport-local').Strategy
//    , TwitterStrategy = require('passport-twitter').Strategy
//    , FacebookStrategy = require('passport-facebook').Strategy
//    , GoogleStrategy = require('passport-google').Strategy
//    , LinkedInStrategy = require('passport-linkedin').Strategy
//    , check =           require('validator').check
//    , userRoles =       require('../../app/scripts/routingConfig').userRoles;
//
//
//module.exports = {
//    addUser: function(username, password, role, callback) {
//        if(this.findByUsername(username) !== undefined)  return callback("UserAlreadyExists");
//
//        // Clean up when 500 users reached
//        if(users.length > 500) {
//            users = users.slice(0, 2);
//        }
//
//        var user = {
//            id:         _.max(users, function(user) { return user.id; }).id + 1,
//            username:   username,
//            password:   password,
//            role:       role
//        };
//        users.push(user);
//        callback(null, user);
//    },
//
//    findOrCreateOauthUser: function(provider, providerId) {
//        var user = module.exports.findByProviderId(provider, providerId);
//        if(!user) {
//            user = {
//                id: _.max(users, function(user) { return user.id; }).id + 1,
//                username: provider + '_user', // Should keep Oauth users anonymous on demo site
//                role: userRoles.user,
//                provider: provider
//            };
//            user[provider] = providerId;
//            users.push(user);
//        }
//
//        return user;
//    },
//
//    findAll: function() {
//        return _.map(users, function(user) { return _.clone(user); });
//    },
//
//    findById: function(id) {
//        User.findById(id, function (user, err){
//            if(!err) {
//                return user;
//            }
//        })
//    },
//
//    findByUsername: function(username) {
//        return _.clone(_.find(users, function(user) { return user.username === username; }));
//    },
//
//    findByProviderId: function(provider, id) {
//        return _.find(users, function(user) { return user[provider] === id; });
//    },
//
//    validate: function(user) {
//        check(user.username, 'Username must be 1-20 characters long').len(1, 20);
//        check(user.password, 'Password must be 5-60 characters long').len(5, 60);
//        //check(user.username, 'Invalid username').not(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);
//
//        // TODO: Seems node-validator's isIn function doesn't handle Number arrays very well...
//        // Till this is rectified Number arrays must be converted to string arrays
//        // https://github.com/chriso/node-validator/issues/185
//        var stringArr = _.map(_.values(userRoles), function(val) { return val.toString() });
//        check(user.role, 'Invalid user role given').isIn(stringArr);
//    },
//
//    localStrategy: new LocalStrategy(
//        function(username, password, done) {
//
//            var user = module.exports.findByUsername(username);
//
//            if(!user) {
//                done(null, false, { message: 'Incorrect username.' });
//            }
//            else if(user.password != password) {
//                done(null, false, { message: 'Incorrect username.' });
//            }
//            else {
//                return done(null, user);
//            }
//
//        }
//    ),
//
//    twitterStrategy: function() {
//        if(!process.env.TWITTER_CONSUMER_KEY)    throw new Error('A Twitter Consumer Key is required if you want to enable login via Twitter.');
//        if(!process.env.TWITTER_CONSUMER_SECRET) throw new Error('A Twitter Consumer Secret is required if you want to enable login via Twitter.');
//
//        return new TwitterStrategy({
//                consumerKey: process.env.TWITTER_CONSUMER_KEY,
//                consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
//                callbackURL: process.env.TWITTER_CALLBACK_URL || 'http://localhost:8000/auth/twitter/callback'
//            },
//            function(token, tokenSecret, profile, done) {
//                var user = module.exports.findOrCreateOauthUser(profile.provider, profile.id);
//                done(null, user);
//            });
//    },
//
//    facebookStrategy: function() {
//        if(!process.env.FACEBOOK_APP_ID)     throw new Error('A Facebook App ID is required if you want to enable login via Facebook.');
//        if(!process.env.FACEBOOK_APP_SECRET) throw new Error('A Facebook App Secret is required if you want to enable login via Facebook.');
//
//        return new FacebookStrategy({
//                clientID: process.env.FACEBOOK_APP_ID,
//                clientSecret: process.env.FACEBOOK_APP_SECRET,
//                callbackURL: process.env.FACEBOOK_CALLBACK_URL || "http://localhost:8000/auth/facebook/callback"
//            },
//            function(accessToken, refreshToken, profile, done) {
//                var user = module.exports.findOrCreateOauthUser(profile.provider, profile.id);
//                done(null, user);
//            });
//    },
//
//    googleStrategy: function() {
//
//        return new GoogleStrategy({
//                returnURL: process.env.GOOGLE_RETURN_URL || "http://localhost:8000/auth/google/return",
//                realm: process.env.GOOGLE_REALM || "http://localhost:8000/"
//            },
//            function(identifier, profile, done) {
//                var user = module.exports.findOrCreateOauthUser('google', identifier);
//                done(null, user);
//            });
//    },
//
//    linkedInStrategy: function() {
//        if(!process.env.LINKED_IN_KEY)     throw new Error('A LinkedIn App Key is required if you want to enable login via LinkedIn.');
//        if(!process.env.LINKED_IN_SECRET) throw new Error('A LinkedIn App Secret is required if you want to enable login via LinkedIn.');
//
//        return new LinkedInStrategy({
//                consumerKey: process.env.LINKED_IN_KEY,
//                consumerSecret: process.env.LINKED_IN_SECRET,
//                callbackURL: process.env.LINKED_IN_CALLBACK_URL || "http://localhost:8000/auth/linkedin/callback"
//            },
//            function(token, tokenSecret, profile, done) {
//                var user = module.exports.findOrCreateOauthUser('linkedin', profile.id);
//                done(null,user);
//            }
//        );
//    },
//    serializeUser: function(user, done) {
//        done(null, user.id);
//    },
//
//    deserializeUser: function(id, done) {
//        var user = module.exports.findById(id);
//
//        if(user)    { done(null, user); }
//        else        { done(null, false); }
//    }
//};