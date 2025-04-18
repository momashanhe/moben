const express = require('express');
const jwt = require('jsonwebtoken');
const md5 = require('md5');

const { TOKEN_SERCET } = require('../../config/config');

const mongoose = require('../../db/mongodb');
const userModel = require('../../models/user');

const router = express.Router();

/* 签发请求 */
router.post('/sign', function (req, res, next) {
  req.body.password = md5(req.body.password);
  userModel.findOne(req.body).then(
    data => {
      if (!data) {
        return res.json({
          code: '200',
          msg: '请求成功',
          data: { code: '2000', msg: '用户不存在', data: {} }
        });
      }
      // 签发Token
      try {
        console.log(data);
        let token = jwt.sign({ ...data }, TOKEN_SERCET, { expiresIn: 600 });
        return res.json({
          code: '200',
          msg: '请求成功',
          data: { code: '0000', msg: '签发成功', data: { token } }
        });
      } catch (error) {
        return res.json({
          code: '200',
          msg: '请求成功',
          data: { code: '2001', msg: '签发失败: ' + error.message, data: {} }
        });
      }
    },
    err => {
      return res.json({ code: '500', msg: '请求失败: ' + err, data: {} });
    }
  );
});

module.exports = router;
