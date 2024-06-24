// utils/fileUtils.js
const path = require('path');

module.exports = {
  getBaseName: (filePath) => path.basename(filePath),
};
