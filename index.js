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

  // Guarantee dates are valid
  this.atime = new Date(opts.atime);
  if (!isValidDate(this.atime)) {
    this.atime = new Date();
  }
  this.mtime = new Date(opts.mtime);
  if (!isValidDate(this.mtime)) {
    this.mtime = new Date();
  }
  this.ctime = new Date(opts.ctime);
  if (!isValidDate(this.ctime)) {
    this.ctime = new Date();
  }
  this.birthtime = new Date(opts.birthtime);
  if (!isValidDate(this.birthtime)) {
    this.birthtime = new Date();
  }
}

isTypeMethods.forEach(function(method){
  Stats.prototype[method] = function(){
    return this.mode[method]();
  };
});

module.exports = Stats;
