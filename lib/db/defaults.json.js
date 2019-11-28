
const qm = require('quick-merge').quickMergeImmutable;

module.exports = json();

function json(argv ={}) {

  const base = {
    codename: 'xenial',
  };

  return qm(base, argv);
}

if (require.main === module) {
  console.log(JSON.stringify(require(__filename), null, 2));
}
