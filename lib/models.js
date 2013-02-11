var db = require('./db')('rethinkdb');
var utils = require('./utils');


var Project = function(opts) {
  if(!opts) opts = {};

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

  this._table = 'projects';
  return this;
}


Project.prototype.save = function(cb){
  if(!this.name) return cb(new Error('Project requires a name'));

  var cur = db.table(this._table).filter({URI:this.URI}).count().run();
  cur.collect(function(count) {
    if(count > 0) return cb(new Error('URI already exists'));
  });

  if(this.id){
    db.table(this._table).get(this.id).update(this).run( function(result){
      return cb(null, result);
    });
  }else{
    db.table(this._table).insert(this).run( function(result){
      return cb(null, result);
    });
  }
};

Project.prototype.get = function(id, cb){
   if(!id) return cb(new Error('Project id cannot be null'));

   db.table(this._table).get(id).run(function(project){
     if(cb) return cb(null, project);
     return db.table(this._table).get.run();
   });
};

Project.prototype.getEnabled = function(cb){
   var cur = db.table(this._table).filter({'enabled':true}).run();
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

  db.table(this._table).get(id).del().run(function(result){
    return cb(result);
  });

};

Project.prototype.getConn = function(){ return db };

exports.Project = Project;
