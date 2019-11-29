
const sg = require('sg0');
const {path}  = sg.sysMods();
const util    = require('util');

// const {include,log} = require('./utils');
// const {include,log} = require('../utils');
// const {include,log} = require('../../utils');

const log =
module.exports.log = function(msg, obj) {
  // console.error(msg, util.inspect(obj));
};

module.exports.include = function(...args) {
  try {
    const args2 = sg.compact(args);
    var   fullpath = path.join(...args2);
    if (fullpath[0] !== '.' && fullpath[0] !== '/') {
      fullpath = './' + fullpath;
    }

    log(`incl`, {fullpath});
    var result = require(fullpath);
    if (typeof result === 'function') {
      result = result();
    }
    return result;
  } catch(err) {
    if (err.code !== 'MODULE_NOT_FOUND') {
      console.error(err);
    }
  }
};
