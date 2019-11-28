
const defs = require('../defaults.json');

module.exports = json;

function json(argv =defs) {

  var {codename}  = argv;

  return {
    "apt": {
      "add_key": "https://deb.nodesource.com/gpgkey/nodesource.gpg.key",
      "sources": {
        "nodesource": {
          "deb": `https://deb.nodesource.com/node_12.x ${codename} main`,
          "deb_src": `https://deb.nodesource.com/node_12.x ${codename} main`
        }
      }
    }
  };
}

if (require.main === module) {
  console.log(JSON.stringify(require(__filename)(), null, 2));
}
