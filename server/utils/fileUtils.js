const path = require('path');

module.exports = {
  getBaseName: (filePath) => path.basename(filePath),
};