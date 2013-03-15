var db = require('./db')('couchdb');
var util = require('util');
var utils = require('./utils');

var Project = function(opts) {
  if(!opts) opts = {};

  this.id = opts.id || null;
  this.name = opts.name || null;
  this.enabled = opts.enabled || true;
  this.URI = opts.URI || null;
  this.lastBackup = null;
  this.failedBackups = 0;
  this.currentStatus = 0;
  this.backupMethod = null;
  this.backupFrequency = null;
  this.bundlePath = null;
  this.lastLog = null;
  this.errorLog = null;
  this.db = db.db;

  return this;
}


Project.prototype.save = function(cb){
  if(!this.name) return cb(new Error('Project requires a valid name'));
  if(!this.URI) return cb(new Error('Project requires a valid URI'));

  /*db.table(this._table).filter({URI:this.URI}).count().run();
  cur.collect(function(count) {
    if(count > 0) return cb(new Error('URI already exists'));
  });
  */
  var p = {
    name: this.name,
    URI:  this.URI,
    enabled: this.enabled,
    id: this.id || utils.generateID(),
    lastBackup: this.lastBackup || null,
    failedBackups: this.failedBackups || 0,
    currentStatus: this.currentStatus || 0,
    backupMethod: this.backupMethod || null,
    backupFrequency: this.backupFrequency || null,
    bundlePath: this.bundlePath || null,
    lastLog: this.lastLog || null,
    errorLog: this.errorLog || null
  };

    this.db.save(p.id, p, function(err, result){
      return cb(null, result);
    });
};

Project.prototype.get = function(id, cb){
   if(!id) return cb(new Error('Project id cannot be null'));

   this.db.get(id, function(err, project){
     if(cb) return cb(null, project);
     return db.table(project);
   });
};

Project.prototype.getEnabled = function(cb){
   this.db.view('project/enabled', function(err, projects){
     if(err && err.reason === 'missing') return cb(null, []);
     if(err) return cb(new Error(err));
     else {
       var ps = [];
       for(p in projects){
         var project = utils.mergeRecursive(new Project(), projects[p]);
         ps.push(project);
       }
       return cb(null, ps);
     }
   });
};

Project.prototype.getFiltered = function(filter, cb) {
  var cur = db.table(this._table).filter(filter).run();
  cur.collect(function(results) {
    var projects = [];
    for(result in results){
      var project = utils.mergeRecursive(new Project(), results[result]);
      projects.push(project);
    }

    if(cb) return cb(null, projects);
    return projects;
  });
};

Project.prototype.delete = function(id, cb){
  var self = this;
    self.db.remove(id, result._rev, function(err, result){
      return cb(err, result);
  });
};

Project.prototype.getConn = function(){ return db };

exports.Project = Project;
