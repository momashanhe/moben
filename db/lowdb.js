const low = require('lowdb');
const path = require('path');

const FileSync = require('lowdb/adapters/FileSync');
const file = path.resolve(__dirname, 'lowdb.json');
const adapter = new FileSync(file);
const db = low(adapter);

module.exports = db;