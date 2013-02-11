var mongoose = require('mongoose');
var db = require('../lib/db')('rethinkdb');

// Repo
// ----
var schema = mongoose.Schema({
  name: { type: String, required: true },
  enabled: {type: Boolean, default: true},
  URI: { type: String, required: true },
  lastBackup: Date,
  failedBackups: { type: Number, default: 0},
  currentStatus: Number,
  backupMethod: String,
  backupFrequency: String,
  bundlePath: String,
  lastLog: String
});

function MergeRecursive(obj1, obj2) {

  for (var p in obj2) {
    try {
      // Property in destination object set; update its value.
      if ( obj2[p].constructor==Object ) {
        obj1[p] = MergeRecursive(obj1[p], obj2[p]);

      } else {
        obj1[p] = obj2[p];

      }

    } catch(e) {
      // Property in destination object not set; create it and set its value.
      obj1[p] = obj2[p];

    }
  }

  return obj1;
}

var Project = function(opts) {
  //if(!opts) return new Error('Initialising options not provided');
  //var requiredOpts = ['name', 'uri'];
  //for(opt in requiredOpts){
  //  if(!opts[opt]) return new Error(opt + ' is required');
  // }
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

  var ins = { name: this.name, URI: this.URI };

  if(this.id){

    db.table(this._table).get(this.id).update(this).run( function(result){
      cb(null, result);
    });

  }else{

    db.table(this._table).insert(this).run( function(result){
      cb(null, result);
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
       var project = MergeRecursive(new Project(), results[result]);
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
      var project = MergeRecursive(new Project(), results[result]);
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
Project.prototype.update = function(){};
Project.prototype.getConn = function(){ return db };

//schema.virtual('validate.uri').get(function(){
//  return true;
//});

//exports.Project = db.model('Project', schema);

exports.Project = Project;
