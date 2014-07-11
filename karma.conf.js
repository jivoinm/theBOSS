// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'app/bower_components/jquery/dist/jquery.js',
            'app/bower_components/angular/angular.js',
            'app/bower_components/angular-mocks/angular-mocks.js',
            'app/bower_components/angular-resource/angular-resource.js',
            'app/bower_components/angular-cookies/angular-cookies.js',
            'app/bower_components/angular-sanitize/angular-sanitize.js',
            'app/bower_components/angular-route/angular-route.js',
            'app/bower_components/angular-route/angular-route.js',
            'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'app/bower_components/angular-dialog-service/dialogs.js',
            'app/bower_components/select2/select2.js',
            'app/bower_components/angular-ui-select2/src/select2.js',
            'app/bower_components/angular-ui-calendar/src/calendar.js',
            'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'app/bower_components/dialogs/dialogs.js',
            'app/bower_components/angular-animate/angular-animate.js',
            'app/bower_components/AngularJS-Toaster/toaster.js',
            'app/bower_components/angular-loading-bar/src/loading-bar.js',
            'app/bower_components/angular-dragdrop/src/angular-dragdrop.js',
            'app/bower_components/ng-file-upload/angular-file-upload.js',
            'app/bower_components/bootstrap-tokenfield/dist/bootstrap-tokenfield.js',
            'app/bower_components/moment/moment.js',
            'app/bower_components/angular-moment/angular-moment.js',
            'app/bower_components/angular-ui-router/release/angular-ui-router.js',

            'app/scripts/*.js',
            'app/scripts/**/*.js',
            'test/client/mock/**/*.js',
            //'test/client/spec/**/*.js',
            'test/client/spec/**/order.js',
            //'test/client/spec/**/order-details.js',
            'app/views/**/**/*html'
        ],


        preprocessors : {
            'app/views/**/*html': 'html2js'
        },

        // list of files / patterns to exclude
        exclude: [],

        // web server port
        port: 8080,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
