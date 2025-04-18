const express = require('express');
const moment = require('moment');
const shortid = require('shortid');
const md5 = require('md5');

const mongoose = require('../../db/mongodb');
const userModel = require('../../models/user');

const router = express.Router();

/* 登录页面 */
router.get('/login', function (req, res, next) {
  return res.render('auth/login');
});

/* 登录请求 */
router.post('/login', function (req, res, next) {
  req.body.password = md5(req.body.password);
  userModel.findOne(req.body).then(
    data => {
      if (!data) {
        return res.render('failed', { msg: '登录失败', url: '/auth/login' });
      }
      req.session.id = data.id;
      req.session.username = data.username;
      return res.render('success', { msg: '登录成功', url: '/bill/list' });
    },
    err => {
      return res.status(500).send('登录失败: ' + err);
    }
  );
});

/* 注册页面 */
router.get('/register', function (req, res, next) {
  return res.render('auth/register');
});

/* 注册请求 */
router.post('/register', function (req, res, next) {
  let id = shortid.generate();
  req.body.password = md5(req.body.password);
  req.body.time = moment(req.body.time).toDate();
  userModel.insertOne({ id, ...req.body }).then(
    data => {
      return res.render('success', { msg: '注册成功', url: '/auth/login' });
    },
    err => {
      return res.status(500).send('注册失败: ' + err);
    }
  );
});

/* 退出请求 */
router.get('/logout', function (req, res, next) {
  // 删除Session
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('退出失败: ' + err);
    }
    // 删除Cookie
    res.clearCookie('sid', {
      path: '/'
    });
    return res.render('success', { msg: '退出成功', url: '/auth/login' });
  });
});

module.exports = router;
