'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    project = require('./controllers/project'),
    orders = require('./controllers/orders'),
    session = require('./controllers/session');

var middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function (app) {

    // Server API Routes
    app.get('/api/menus', api.menus);
    app.get('/api/messages', middleware.setUserCookie, api.messages);
    app.get('/api/tasks', requiresAuth, api.tasks);
    app.get('/api/alerts', requiresAuth, api.alerts);

    app.post('/api/project', requiresAuth, project.create);
    app.post('/api/users', users.create);
    app.put('/api/users', requiresAuth, users.changePassword);
    app.get('/api/users/me', requiresAuth, users.me);
    app.get('/api/users/:id', requiresAuth, users.show);
    app.post('/api/session', session.login);

    //Orders
    app.get('/api/orders', requiresAuth, orders.loadLatest);

    app.del('/api/session', requiresAuth, session.logout);
    // All undefined api routes should return a 404
    app.get('/api/*', function (req, res) {
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