var VError = require('verror');
var AuthController = require('../controllers/AuthController');
var UserRouter = require('./UserRouter');
var logger = require('../logger');
var log = logger('router');

///////////////////////////
//        HELPERS        //
///////////////////////////

function addAuthenticatedRouter(app, options, path, router, unauthenticatePaths) {
  if (path === options.userPath) {
    var defaultUnauthenticatedUserPaths = getUnauthenticatedUserPaths(options);

    if (!unauthenticatePaths) {
      unauthenticatePaths = defaultUnauthenticatedUserPaths;
    } else if (Array.isArray(unauthenticatePaths)) {
      unauthenticatePaths = unauthenticatePaths.concat(defaultUnauthenticatedUserPaths);
    } else if (typeof unauthenticatePaths === 'string') {
      unauthenticatePaths = [unauthenticatePaths].concat(defaultUnauthenticatedUserPaths);
    }
  }

  addLoggerMiddleware(app, path);

  app.use(options.basePath + path, AuthController.authenticate(unauthenticatePaths, options), router);
}

function addRouter(app, options, path, router) {
  addLoggerMiddleware(app, path);
  app.use(options.basePath + path, router);
}

/////////////////////////
//        INIT         //
/////////////////////////

function init(app, options) {
  addAuthenticatedRouter(app, options, options.userPath, UserRouter(options));

  process.nextTick(function() {
    // error handler configuration after routers are synchronously registered
    addErrorMiddleware(app, options);
  });
}

function addLoggerMiddleware(app, routerPath) {
  app.use(function(req, res, next) {
    req.log = logger(routerPath + ' router');
    next();
  });
}

function addErrorMiddleware(app, options) {
  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new VError('Not Found');
    err.status = 404;
    next(err);
  });

  app.use(function(err, req, res, next) {
    (req.log || log).error(err);

    if (res.headersSent) {
      return next(err);
    }

    var data = options.apiEnvelope(null, err);

    // request library uses statucCode
    res.status(err.status || err.statusCode || 500).send(data);
  });
}

function getUnauthenticatedUserPaths(options) {
  var SIGNUP_PATH = options.basePath + options.userPath + options.routes.signup;
  var RESET_PASSWORD_PATH = new RegExp(options.basePath + options.userPath + options.routes.resetPassword + '/[a-zA-Z0-9]+$');
  return [SIGNUP_PATH, RESET_PASSWORD_PATH];
}

///////////////////////////
//        PUBLIC         //
///////////////////////////

exports = module.exports = init;

exports.addRouter = addRouter;
exports.addAuthenticatedRouter = addAuthenticatedRouter;