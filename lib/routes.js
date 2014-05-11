'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    forms = require('./controllers/forms'),
    orders = require('./controllers/orders'),
    calendar = require('./controllers/calendar'),
    session = require('./controllers/session');

var middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function (app) {

    // Server API Routes
    app.get('/api/menus', api.menus);
    app.get('/api/messages', middleware.setUserCookie, api.messages);
    app.get('/api/tasks', api.tasks);
    app.get('/api/alerts', api.alerts);

    app.post('/api/forms', forms.create);
    app.get('/api/forms/:module', forms.getFormsForModuls);

    app.post('/api/users', users.create);
    app.put('/api/users', users.changePassword);
    app.get('/api/users/me', users.me);
    app.get('/api/users/:id', users.show);
    app.post('/api/session', session.login);

    //Calendar
    app.get('/api/calendar/:from/:to',requiresAuth, calendar.getCalendar);
    app.post('/api/calendar',requiresAuth, calendar.createCalendar);
    app.post('/api/calendar/:id',requiresAuth, calendar.updateCalendar);
    app.delete('/api/calendar/:id',requiresAuth, calendar.deleteCalendar);
    //Orders
    app.post('/api/orders',requiresAuth, orders.createOrder);
    app.post('/api/orders/:id',requiresAuth, orders.updateOrder);
    app.patch('/api/orders/:id/:scheduled',requiresAuth, orders.partialUpdate);
    app.get('/api/orders',requiresAuth, orders.loadLatest);
    app.get('/api/orders/unscheduled',requiresAuth, orders.unscheduled);
    app.get('/api/orders/:id',requiresAuth, orders.loadOrder);
    app.get('/api/orders/:id/projects',requiresAuth, orders.loadOrderProjectFields);
    app.get('/api/orders/:id/tasks',requiresAuth, orders.loadOrderProjectTasks);

    app.get('/api/users/:id/orders', orders.loadUserLatest);

    app.del('/api/session', session.logout);
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