const jwt = require('jsonwebtoken');
const { TOKEN_SERCET } = require('../config/config');

// 令牌检测中间件
module.exports = (req, res, next) => {
  let token = req.get('token');
  if (!token) {
    return res.json({
      code: '200',
      msg: '请求成功',
      data: { code: '2002', msg: '令牌不存在', data: {} }
    });
  }
  // 验证Token
  try {
    let data = jwt.verify(token, TOKEN_SERCET);
    // 传递参数
    req.user = data;
    next();
  } catch (error) {
    return res.json({
      code: '200',
      msg: '请求成功',
      data: { code: '2003', msg: '验证失败: ' + error.message, data: {} }
    });
  }
};
