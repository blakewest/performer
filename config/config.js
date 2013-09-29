var path = require('path');
var rootPath = path.join(__dirname + '..');
var production = process.env.NODE_ENV;
module.exports = {
  development: {
    db: 'mongodb://localhost/performer',
    root: rootPath,
    port: 3000
  },
  production: {
    db:'mongodb://myremotedb/performer'
  }
};