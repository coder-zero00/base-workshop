
const defs = require('../defaults.json');

module.exports = json;

function json(argv =defs) {

  var {codename}  = argv;

  return {
    "apt": {
      "add_apt_repository": {
        "golang-go" : "ppa:longsleep/golang-backports",
      }
    }
  };
}

if (require.main === module) {
  console.log(JSON.stringify(require(__filename)(), null, 2));
}
