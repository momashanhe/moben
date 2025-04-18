const express = require('express');
const moment = require('moment');
const shortid = require('shortid');

// const db = require('../../db/lowdb');
const mongoose = require('../../db/mongodb');
const billModel = require('../../models/bill');

// 导入登录检测中间件
const checkUser = require('../../middlewares/checkUser');

const router = express.Router();

/* 列表页面 */
router.get(['/', '/list'], checkUser, function (req, res, next) {
  // let data = db.get('bills').value();
  billModel.find().then(
    data => {
      data.forEach(bill => {
        bill.date = moment(bill.time).format('YYYY-MM-DD');
      });
      return res.render('bill/list', { data });
    },
    err => {
      return res.status(500).send('查询失败: ' + err);
    }
  );
});

/* 详情页面 */
router.get('/detail/:id', checkUser, function (req, res, next) {
  let id = req.params.id;
  billModel.findOne({ id }).then(
    data => {
      data.date = moment(data.time).format('YYYY-MM-DD');
      return res.render('bill/detail', data);
    },
    err => {
      return res.status(500).send('查询失败: ' + err);
    }
  );
});

/* 添加页面 */
router.get('/add', checkUser, function (req, res, next) {
  return res.render('bill/add');
});

/* 添加请求 */
router.post('/create', checkUser, function (req, res, next) {
  let id = shortid.generate();
  // db.get('bills').unshift({ id, ...req.body }).write();
  req.body.time = moment(req.body.time).toDate();
  billModel.insertOne({ id, ...req.body }).then(
    data => {
      return res.render('success', { msg: '添加成功', url: '/bill/list' });
    },
    err => {
      return res.status(500).send('添加失败: ' + err);
    }
  );
});

/* 删除请求 */
router.get('/delete/:id', checkUser, function (req, res, next) {
  let id = req.params.id;
  // db.get('bills').remove({ id }).write();
  billModel.deleteOne({ id }).then(
    data => {
      return res.render('success', { msg: '删除成功', url: '/bill/list' });
    },
    err => {
      return res.status(500).send('删除失败: ' + err);
    }
  );
});

/* 修改页面 */
router.get('/edit/:id', checkUser, function (req, res, next) {
  let id = req.params.id;
  billModel.findOne({ id }).then(
    data => {
      data.date = moment(data.time).format('YYYY-MM-DD');
      return res.render('bill/edit', data);
    },
    err => {
      return res.status(500).send('查询失败: ' + err);
    }
  );
});

/* 修改请求 */
router.post('/update', checkUser, function (req, res, next) {
  req.body.time = moment(req.body.time).toDate();
  billModel.updateOne({ id: req.body.id }, req.body).then(
    data => {
      return res.render('success', { msg: '修改成功', url: '/bill/list' });
    },
    err => {
      return res.status(500).send('修改失败: ' + err);
    }
  );
});

module.exports = router;
