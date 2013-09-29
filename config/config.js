var path = require('path');
var rootPath = path.join(__dirname + '..');
module.exports = {
  development: {
    db: 'mongodb://localhost/performer',
    root: rootPath,
    port: 3000
  },
  production: {
    db: 'mongodb://bwest87:astra120u@ds047468.mongolab.com:47468/heroku_app18382102'
  }
};