
const sg                      = require('sg0');
const {_}                     = sg;
const qm                      = require('quick-merge').quickMergeImmutable;
const {include,log}           = require('./utils');
const {writeDockerfile}       = require('./generation/write-dockerfile');

const base_images = {
  ubuntu:   'trusty,xenial,bionic,focal',
  alpine:   '3.7,3.8,3.9,3.10',
  busy_box: 'uclibc,glibc,musl',
  redis:    '',
  node:     'carbon,carbon-onbuild,buster,lts',
  nginx:    'mainline,latest,mainline-perl,perl,mainline-alpine,alpine,alpine-perl,stable,stable-perl,stable-alpine,stable-alpine-perl',
  mongo:    'bionic,3-xenial,3.4-xenial,3.6-xenial,4.0-xenial,4-bionic,4.2-bionic',
  logstash: '',
  kibana:   '',
};

const partsNames = 'root,base,light,medium'.split(',');

// ----------------------------------------------------------------------------------------------------------------------------
function generateDockerfile(name) {
  var intermediate  = {parts: []};
  var item;
  var pkgIndex = {packages:{}, items:{}};

  var spec = partsNames.reduce((m, name__) => {
    const name_ = `${name__}-development`;
    const part = require(`./db/${name_}.json`);
    if (name === name_) {
      item = {part, name: name_};
    }

    _.each(part.packages, (pkgList, pkgMgrName) => {
      pkgList.forEach(pkgName => {
        pkgIndex.packages[pkgMgrName]           = pkgIndex.packages[pkgMgrName]             || {};
        pkgIndex.packages[pkgMgrName][pkgName]  = pkgIndex.packages[pkgMgrName][pkgName]    || {};

        pkgIndex.packages[pkgMgrName][pkgName]  = pkgIndex.packages[pkgMgrName][pkgName] = part;

        pkgIndex.items[pkgName] = part;

        if (name === pkgName) {
          item = {part, name: name_};
        }
      });
    });

    return {...m, [name_]: part};
  }, {});

  spec = require('./db/various.json').reduce((m, spcLet) => {
    const part = {...spcLet};
    if (name === spcLet.name) {
      item = {part, name: spcLet.name};
    }

    return {...m, [spcLet.name]: part};
  }, spec);

  // var spec = require(`./db/${name}.json`);

  intermediate = genParts(intermediate, spec, pkgIndex, item);

  log(`gend`, require('util').inspect(intermediate, null, {colors:true}));


  var lines =  writeDockerfile(intermediate, item);
  process.stdout.write(lines.join('\n') + '\n\n');
}

//-----------------------------------------------------------------------------------------------------------------------------
// Reads in the spec, one part at a time
function genParts(result_, spec, pkgIndex, item) {
  var result      = {...result_};
  var partResult  = {};

  if (item.part && item.part.from) {
    let subSpec = spec[item.part.from];
    result = genParts(result, spec, pkgIndex, {name: item.name, part:subSpec});
  }

  if (item.part && item.part.requires) {
    let part = lookup(pkgIndex, item.part.requires);
    // let subSpec = spec[item.part.from];
    result = genParts(result, spec, pkgIndex, {name: item.name, part});
  }

  _.each(item.part.packages.apt, pkg => {
    const special = include(`./db/package-special-needs/${pkg}.json`);
    partResult = qm(partResult, (special && {special: {[pkg]: special}}) ||{});
  });

  // result = qm(result, {parts:[{...item, ...partResult}]});
  result = qm(result, {parts:[{...item.part, ...partResult}]});

  return result;
}

function lookup(obj, dottedKey) {
  var arrKey = dottedKey.split('.');

  var base = obj;
  while (arrKey.length >= 2) {
    base = base[arrKey.shift()];
  }

  var result = base[arrKey.shift()];

  return result;
}

if (require.main === module) {
  // generateDockerfile('light-development');
  generateDockerfile(process.argv[2] || 'perl');
  // log(JSON.stringify(require(__filename)(), null, 2));
}

