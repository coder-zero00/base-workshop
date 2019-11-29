
const sg = require('sg0');
const {_} = sg;
const qm = require('quick-merge').quickMergeImmutable;
const {include,log} = require('../utils');

module.exports.writeDockerfile = writeDockerfile;

// ----------------------------------------------------------------------------------------------------------------------------
function writeDockerfile(intermediate, item) {
  // console.error(`intermediate is:`, sg.inspect(intermediate));

  var lines = [];

  lines.push(`FROM ubuntu:xenial`);
  lines.push(``);

  _.each(intermediate.parts, part => {
    var partLines = [];

    // ----------------------------------------------
    // npm install -global...
    if (part.packages && part.packages.npm && part.packages.npm.length > 0) {
      addRun(partLines, `npm install --global \\`);

      _.each(part.packages, (pkgs, pkgManagerName) => {
        if (pkgManagerName === 'npm') {
          _.each(pkgs, (pkgName) => {
            if (pkgName !== 'theend')     { addRun(partLines, `  ${pkgName} \\`); }
          });
        }
      });
      addRun(partLines, `  && \\`);
    }

    // ----------------------------------------------
    // pip install...
    if (part.packages && part.packages.pip && part.packages.pip.length > 0) {
      addRun(partLines, `pip install --upgrade \\`);

      _.each(part.packages, (pkgs, pkgManagerName) => {
        if (pkgManagerName === 'pip') {
          _.each(pkgs, (pkgName) => {
            if (pkgName !== 'theend')     { addRun(partLines, `  ${pkgName} \\`); }
          });
        }
      });
      addRun(partLines, `  && \\`);
    }

    // ----------------------------------------------
    // sources.list.d/...
    _.each(part.special, (spPart, name) => {
      var add_key = spPart.apt && spPart.apt.add_key;
      if (add_key) {
        addRun(partLines, `curl -sSL '${add_key}' | apt-key add - && \\`);

        var sources = spPart.apt && spPart.apt.sources;
        _.each(sources, (source, srcName) => {
          if (source.deb)       { addRun(partLines, `echo 'deb ${source.deb}' >> /etc/apt/sources.list.d/${srcName}.list && \\`); }
          if (source.deb_src)   { addRun(partLines, `echo 'deb-src ${source.deb_src}' >> /etc/apt/sources.list.d/${srcName}.list && \\`); }
        });
        addRun(partLines, `echo 'booya' \\`);
        addRun(partLines, `  && \\`);
      }
    });

    // ----------------------------------------------
    // add-apt-repository...
    _.each(part.special, (spPart, name) => {
      var add_apt_repository = spPart.apt && spPart.apt.add_apt_repository;
      if (add_apt_repository) {
        var repos = Object.keys(add_apt_repository).map(key => add_apt_repository[key]);
        if (repos.length > 0) {
          addRun(partLines, `add-apt-repository -y \\`);
          _.each(repos, repo => {
            addRun(partLines, `  ${repo} \\`);
          });
          addRun(partLines, `  && \\`);
        }
      }
    });

    let numPrevLines = partLines.length;
    let numNextLines = part.packages && part.packages.apt && part.packages.apt.length || 0;

    if (numPrevLines > 0) {
      if (numNextLines === 0) {
        addRun(partLines, `echo 'booya'`);
      } else {
        addRun(partLines, `echo 'booya' \\`);
        addRun(partLines, `  && \\`);
      }
    }

    // ----------------------------------------------
    // apt-get install...
    if (part.packages && part.packages.apt && part.packages.apt.length > 0) {
      addRun(partLines, `apt-get update && apt-get install -y --no-install-recommends \\`);

      _.each(part.packages, (pkgs, pkgManagerName) => {
        if (pkgManagerName === 'apt') {
          _.each(pkgs, (pkgName) => {
            if (pkgName !== 'theend')     { addRun(partLines, `  ${pkgName} \\`); }
          });
        }
      });

      addRun(partLines, `  && \\`);
      addRun(partLines, `rm -rf /var/lib/apt/lists/*   && \\`);
      addRun(partLines, `apt-get clean`);
    }
    // ----------------------------------------------

    if (partLines.length > 0) {
      lines = [...lines, ``, ...partLines];
    }

  });

  // process.stdout.write(lines.join('\n') + '\n\n');

  return lines;
}

//-----------------------------------------------------------------------------------------------------------------------------
// Adds a RUN line to the Array of lines, knowing when to actually add 'RUN' and when not
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

