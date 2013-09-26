var path = require('path');
var rootPath = path.join(__dirname + '..');

module.exports = {
  development: {
    db: 'mongodb://localhost/performer',
    root: rootPath,
    port: 3000
  }
};