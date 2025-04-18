const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// 导入Session相关包
const session = require('express-session');
const mongo = require('connect-mongo');

// 导入api接口
const apiBillRouter = require('./routes/api/bill');
const apiTokenRouter = require('./routes/api/token');
// 导入web接口
const billRouter = require('./routes/web/bill');
const authRouter = require('./routes/web/auth');

// 数据库相关配置
const { DB_HOST, DB_PORT, DB_NAME } = require('./config/config');

const app = express();

// 配置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 启用Session中间件
app.use(session({
  name: 'sid',
  secret: 'salt',
  saveUninitialized: false,
  resave: true,
  cookie: {
    maxAge: 600000,
    path: '/',
    httpOnly: true,
    secure: false,
    sameSite: 'strict'
  },
  store: mongo.create({
    mongoUrl: `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`
  }),
}));

app.use('/api/bill', apiBillRouter);
app.use('/api/token', apiTokenRouter);

app.use('/bill', billRouter);
app.use('/auth', authRouter);

// 配置404页面
app.use(function(req, res, next) {
  res.render('404');
});

// 配置500页面
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
