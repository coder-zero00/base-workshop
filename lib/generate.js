
const sg = require('sg0');
const {_} = sg;
const qm = require('quick-merge').quickMergeImmutable;
const {include,log} = require('./utils');

function generateDockerfile(name) {
  var result  = {parts: []};

  var spec = require(`./db/${name}.json`);

  result = genParts(result, spec);

  console.log(`gend`, require('util').inspect(result, null, {colors:true}));

  var lines = [];
  lines.push(``);
  _.each(result.parts, part => {

    // ----------------------------------------------
    var partLines = [];
    _.each(part.special, (spPart, name) => {
      var add_key = spPart.apt && spPart.apt.add_key;
      // if (add_key)       { partLines.push(`curl -sSL '${add_key}' | apt-key add - \\`); }
      if (add_key)       { addRun(partLines, `curl -sSL '${add_key}' | apt-key add - && \\`); }

      var sources = spPart.apt && spPart.apt.sources;
      _.each(sources, (source, srcName) => {
        if (source.deb)       { addRun(partLines, `echo 'deb ${source.deb}' >> /etc/apt/sources.list.d/${srcName}.list && \\`); }
        if (source.deb_src)   { addRun(partLines, `echo 'deb-src ${source.deb_src}' >> /etc/apt/sources.list.d/${srcName}.list && \\`); }
      });
    });

    if (partLines.length > 0) {
      addRun(partLines, `echo 'booya' \\`);
      addRun(partLines, `  && \\`);
    }

    // ----------------------------------------------
    addRun(partLines, `apt-get update && apt-get install -y --no-install-recommends && \\`);

    _.each(part.packages, (pkgs, pkgsName) => {
      // var apt_pkgs = pkgs.apt;

      _.each(pkgs, (pkgName) => {
        if (pkgName !== 'theend')     { addRun(partLines, `${pkgName} \\`); }
      });
    });

    addRun(partLines, `  && \\`);
    addRun(partLines, `rm -rf /var/lib/apt/lists/*   && \\`);
    addRun(partLines, `apt-get clean`);

    if (partLines.length > 0) {
      lines = [...lines, ``, ...partLines];
    }

  });

  console.log(lines.join('\n'));
}

function addRun(lines, ...rest) {
  _.each(rest, line => {
    let theLine = [];
    if (lines.length === 0) {
      theLine = [`RUN`, ...theLine];
    } else {
      theLine = [`   `, ...theLine];
    }
    theLine = [...theLine, line];

    lines.push(theLine.join(' '));
  });
}

function genParts(result_, spec) {
  var result      = {...result_};
  var partResult  = {};

  if (spec.from) {
    let subSpec = require(`./db/${spec.from}.json`);
    result = genParts(result, subSpec);
  }

  _.each(spec.packages.apt, pkg => {
    const special = include(`./db/package-special-needs/${pkg}.json`);
    partResult = qm(partResult, (special && {special: {[pkg]: special}}) ||{});
  });

  result = qm(result, {parts:[{...spec, ...partResult}]});

  return result;
}

if (require.main === module) {
  generateDockerfile('base-development');
  // console.log(JSON.stringify(require(__filename)(), null, 2));
}

