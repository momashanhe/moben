var mongoose = require('../db/mongodb');

const billSchema = new mongoose.Schema({
  id: { type: String, required: [true, '属性不能为空: id'] },
  title: { type: String, required: [true, '属性不能为空: title'] },
  time: { type: Date },
  type: { type: Number },
  cost: { type: Number },
  remark: { type: String }
});

module.exports = mongoose.model('Bill', billSchema);
