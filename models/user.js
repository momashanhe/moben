var mongoose = require('../db/mongodb');

const userSchema = new mongoose.Schema({
  id: { type: String, required: [true, '属性不能为空: id'] },
  username: { type: String, required: [true, '属性不能为空: username'] },
  password: { type: String, required: [true, '属性不能为空: password'] },
  time: { type: Date }
});

module.exports = mongoose.model('User', userSchema);
