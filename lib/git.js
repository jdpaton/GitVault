require('sugar');
require('shelljs/global');

config.silent = true;

var path = require('path');

var Git = function(opts){
  if(!opts) opts = {};

  this.uri = null;
  this.user = null;
  this.email = null;
  this.password = null;
  this.branch = null;
  this.dir = null;

  this._cwdgit = function(){
    return "git --git-dir=" + this.dir + "/.git" + " --work-tree=" + this.dir + " ";
  }

}

Git.prototype.clone = function(cb){

  if(!this.uri || this.uri.isBlank()){
    cb(new Error("URI is null"));
    return;
  }else{
    if (!test('-d', this.dir)){
      mkdir('-p', this.dir);
    }

    exec('git clone ' + this.uri + ' ' + this.dir, function(code, output) {
        if(code != 0) return cb(new Error(output));
        cb(null, output);
    });
  }
}

Git.prototype.getHead = function(cb){
  exec(this._cwdgit() + "rev-parse HEAD", function(code, output){
    cb(null, output);
  });
}

Git.prototype.lastLog = function(cb){
  exec(this._cwdgit() + "log -1", function(code, output){
    cb(null, output.replace(/\n/g, '<br />'));
  });
}

Git.prototype.bundle = function(dest, cb){
  if (test('-rf', dest)){
    rm('-rf', dest);
  }
  exec(this._cwdgit() + 'bundle create ' + dest + ' --all', function(code, output){
     cb(null, output);
  });
}

Git.prototype.repoExists = function(cb){
  if (test('-d', path.join(this.dir, '.git'))){
    cb(null, true);
  }else{
    cb(null, false);
  }
};

Git.prototype.updateRemotes = function(cb){
  exec(this._cwdgit() + 'remote update', function(code, output){
     cb(null, output);
  });

}

module.exports = Git;
