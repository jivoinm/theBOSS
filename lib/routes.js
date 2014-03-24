'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    messages = require('./controllers/message'),
    session = require('./controllers/session');

var middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app) {

    // Server API Routes

    app.post('/api/users', users.create);

    app.put('/api/users', users.changePassword);
    app.get('/api/users/me', users.me);
    app.get('/api/users/:id', users.show);
    app.post('/api/session', session.login);

    app.get('/api/messages/:userName',messages.get);
    app.del('/api/session', session.logout);
    // All undefined api routes should return a 404
    app.get('/api/*', function(req, res) {
        res.send(404);
    });

    // All other routes to use Angular routing in app/scripts/app.js
    app.get('/partials/*', index.partials);

    app.get('/*', middleware.setUserCookie, index.index);

    function requiresAuth(req, res, next) {
        if (req.isAuthenticated()) return next();
        res.statusCode = 401;
        var json_resp = {};
        if (req.method == 'GET') json_resp.returnTo = req.originalUrl
        res.json(json_resp)
    }
};