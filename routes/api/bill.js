const express = require('express');
const moment = require('moment');
const shortid = require('shortid');

const mongoose = require('../../db/mongodb');
const billModel = require('../../models/bill');

// 导入令牌检测中间件
const checkToken = require('../../middlewares/checkToken');

const router = express.Router();

/* 列表数据 */
router.get('/list', checkToken, function (req, res, next) {
  console.log(req.user);
  billModel.find().then(
    data => {
      if (!data) {
        return res.json({
          code: '200',
          msg: '请求成功',
          data: { code: '1000', msg: '数据不存在', data: {} }
        });
      }
      data.forEach(bill => {
        bill.date = moment(bill.time).format('YYYY-MM-DD');
      });
      return res.json({
        code: '200',
        msg: '请求成功',
        data: { code: '0000', msg: '查询成功', data: data }
      });
    },
    err => {
      return res.json({ code: '500', msg: '请求失败: ' + err, data: {} });
    }
  );
});

/* 详情数据 */
router.get('/detail/:id', checkToken, function (req, res, next) {
  let id = req.params.id;
  billModel.findOne({ id }).then(
    data => {
      if (!data) {
        return res.json({
          code: '200',
          msg: '请求成功',
          data: { code: '1000', msg: '数据不存在', data: {} }
        });
      }
      data.date = moment(data.time).format('YYYY-MM-DD');
      return res.json({
        code: '200',
        msg: '请求成功',
        data: { code: '0000', msg: '查询成功', data: data }
      });
    },
    err => {
      return res.json({ code: '500', msg: '请求失败: ' + err, data: {} });
    }
  );
});

/* 添加请求 */
router.post('/create', checkToken, function (req, res, next) {
  let id = shortid.generate();
  req.body.time = moment(req.body.time).toDate();
  billModel.insertOne({ id, ...req.body }).then(
    data => {
      return res.json({
        code: '200',
        msg: '请求成功',
        data: { code: '0000', msg: '添加成功', data: data }
      });
    },
    err => {
      return res.json({ code: '500', msg: '请求失败: ' + err, data: {} });
    }
  );
});

/* 删除请求 */
router.get('/delete/:id', checkToken, function (req, res, next) {
  let id = req.params.id;
  billModel.deleteOne({ id }).then(
    data => {
      return res.json({
        code: '200',
        msg: '请求成功',
        data: { code: '0000', msg: '删除成功', data: data }
      });
    },
    err => {
      return res.json({ code: '500', msg: '请求失败: ' + err, data: {} });
    }
  );
});

/* 修改请求 */
router.post('/update', checkToken, function (req, res, next) {
  req.body.time = moment(req.body.time).toDate();
  billModel.updateOne({ id: req.body.id }, req.body).then(
    data => {
      return res.json({
        code: '200',
        msg: '请求成功',
        data: { code: '0000', msg: '修改成功', data: data }
      });
    },
    err => {
      return res.json({ code: '500', msg: '请求失败: ' + err, data: {} });
    }
  );
});

module.exports = router;
