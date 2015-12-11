'use strict';

var StatMode = require('stat-mode');

var isTypeMethods = [
  'isFile',
  'isDirectory',
  'isBlockDevice',
  'isCharacterDevice',
  'isSymbolicLink',
  'isFIFO',
  'isSocket'
];

function isValidDate(date) {
  return date instanceof Date && !isNaN(date.valueOf());
}

function normalizeStats(stats){
  var now = new Date();

  if (!isValidDate(stats.mtime)) {
    stats.mtime = now;
  }

  if (!isValidDate(stats.atime)) {
    stats.atime = stats.mtime;
  }

  if (!isValidDate(stats.ctime)) {
    stats.ctime = stats.mtime;
  }

  if (!isValidDate(stats.birthtime)) {
    if (stats.ctime <= stats.atime) {
      stats.birthtime = stats.ctime;
    } else {
      // atime was articifially set before last ctime
      stats.birthtime = stats.atime;
    }
  }
}

function Stats(opts) {
  this.dev = opts.dev;
  this.nlink = opts.nlink;
  this.uid = opts.uid;
  this.gid = opts.gid;
  this.rdev = opts.rdev;
  this.blksize = opts.blksize;
  this.ino = opts.ino;
  this.size = opts.size;
  this.blocks = opts.blocks;

  var _mode;
  Object.defineProperty(this, 'mode', {
    enumerable: true,
    get: function() {
      return _mode;
    },
    set: function(mode) {
      _mode = new StatMode({ mode: mode });
    }
  });
  this.mode = opts.mode;

  this.atime = new Date(opts.atime);
  this.mtime = new Date(opts.mtime);
  // TODO: read-only?
  this.ctime = new Date(opts.ctime);
  // TODO: read-only?
  this.birthtime = new Date(opts.birthtime);
  // Guarantee dates are valid
  normalizeStats(this);
}

isTypeMethods.forEach(function(method){
  Stats.prototype[method] = function(){
    return this.mode[method]();
  };
});

module.exports = Stats;
