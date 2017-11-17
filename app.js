var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var settings = require('./settings');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');

var index = require('./routes/index');
var login = require('./routes/login');
var register = require('./routes/register');
var home = require('./routes/home');
var info = require('./routes/info');
var personal = require('./routes/personal');
var search = require('./routes/search');
var test = require('./routes/test');

var app = express();

app.use(session({
  secret:settings.cookieSecret,
  key:settings.db,//cookie name
  // cookie:{maxAge: 1000*60*60*24*30},//30天，毫秒，设置什么时候清除，不写默认为null，这样当浏览器关闭时就会自动清空
  cookie:{maxAge: 1000*60*60*24},
  resave: false,
  saveUninitialized: true,
  //把会话信息存储到数据库中，这样就不会因为浏览器关闭而自动清空，可以做那种两周内记住密码功能
  store: new MongoStore({
    db:settings.db,
    // host:settings.host,
    // port:settings.port
    url: 'mongodb://127.0.0.1/kampong'
  })
}));

// view engine setup
/*app.set('port',process.env.PORT||3000);*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/login', login);
app.use('/register', register);
app.use('/home', home);
app.use('/info', info);
app.use('/personal', personal);
app.use('/search', search);
app.use('/test', test);

// catch 404 and forward to error handler
app.listen(8000,function(){
  console.log('node is ok');
});

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
