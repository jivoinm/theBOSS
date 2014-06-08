'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    customer = require('./controllers/customers'),
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
    app.get('/api/menus', middleware.setUserCookie,requiresAuth, api.menus);
    app.get('/api/messages', requiresAuth, api.messages);
    app.post('/api/messages', requiresAuth, api.createMessage);
    app.get('/api/alerts',requiresAuth, api.alerts);

    app.post('/api/forms', forms.createOrUpdate);
    app.post('/api/forms/:id', forms.createOrUpdate);
    app.delete('/api/forms/:id', forms.deleteForm);
    app.get('/api/forms/:module', forms.getFormsForModule);
    app.put('/api/forms/:id/:target', forms.addField);
    app.put('/api/forms/:id/:target/:targetId', forms.updateField);
    app.delete('/api/forms/:id/field/:fieldId', forms.deleteField);

    //Users
    app.post('/api/users', users.create);
    app.put('/api/users', requiresAuth, users.changePassword);
    app.get('/api/users', requiresAuth, users.queryByName);
    app.get('/api/users/me',requiresAuth, users.me);
    app.get('/api/users/:id',requiresAuth, users.show);
    app.post('/api/session', session.login);

    //Customer
    app.get('/api/customer',requiresAuth, customer.queryByName);

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
    app.get('/api/orders/tasks',requiresAuth,orders.tasks);
    app.get('/api/orders/:id',requiresAuth, orders.loadOrder);
    app.get('/api/orders/:id/projects',requiresAuth, orders.loadOrderProjectFields);
    app.post('/api/orders/:id/upload',requiresAuth, orders.fileUpload);

    app.get('/api/users/:id/orders', orders.loadUserLatest);

    app.get('/api/schema/:model', index.modelToJson);


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