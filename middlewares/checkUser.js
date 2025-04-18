// 登录检测中间件
module.exports = (req, res, next) => {
  if (!req.session.username) {
    return res.redirect('/auth/login');
  }
  next();
}