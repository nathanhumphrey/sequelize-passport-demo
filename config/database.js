const path = require('path');

module.exports = {
  development: {
    storage: path.resolve(__dirname, '../db/test.sqlite'),
    dialect: 'sqlite'
  }
};
