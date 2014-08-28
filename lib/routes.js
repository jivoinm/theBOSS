'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    forms = require('./controllers/forms'),
    orders = require('./controllers/orders'),
    session = require('./controllers/session');

var middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function (app) {

    // Server API Routes
    app.get('/api/menus', middleware.setUserCookie, api.menus);
    app.get('/api/messages', requiresAuth, api.messages);
    app.post('/api/messages', requiresAuth, api.createMessage);
    app.post('/api/messages/:id', requiresAuth, api.updateMessage);
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

    //Orders
    app.post('/api/orders',requiresAuth, orders.createOrder);
    app.post('/api/orders/:id',requiresAuth, orders.updateOrder);
    app.delete('/api/orders/:id',requiresAuth, orders.delete);
    app.patch('/api/orders/:id/status/:status',requiresAuth, orders.updateStatus);
    app.patch('/api/orders/:id/daterequired/:date_required',requiresAuth, orders.updateDateRequired);
    app.get('/api/orders',requiresAuth, orders.loadLatest);
    app.get('/api/orders/unscheduled',requiresAuth, orders.unscheduled);
    app.get('/api/orders/todotasks',requiresAuth,orders.toDoTasks);
    app.get('/api/orders/accessories',requiresAuth,orders.accessories);
    app.get('/api/orders/comments',requiresAuth,orders.comments);
    app.get('/api/orders/calendar/:from/:to',requiresAuth,orders.loadOrdersByStatusAndPeriod);
    app.get('/api/orders/calendar/:from/:to/:status',requiresAuth,orders.loadOrdersByStatusAndPeriod);
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