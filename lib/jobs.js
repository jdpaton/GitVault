require('sugar');

var path = require('path');
var Git = require('./git');
var models = require('./models');

var jobProcessor = function(opts){

  this.interval = "30000";
  this.repoDir = "/tmp/gitbackups";
  this.running = false;

}

jobProcessor.prototype.start = function(){
  var self = this;
  setInterval(function(){
    self.running = true;
    models.Project.find({enabled: true}, function(err, projects){
      projects.each(function(project){

        var git = new Git();
        git.uri = project.URI;
        git.dir = path.join(self.repoDir, project.id)
        git.bundlePath = path.join(git.dir, 'bundle');
        project.bundlePath = git.bundlePath;

        git.repoExists(function(err, exists){
          if(exists){
            git.updateRemotes(function(err, output){
              git.bundle(git.bundlePath, function(err,output){
                if(err){
                  console.log(err);
                  project.currentStatus = 1;
                  project.failedBackups += 1;
                }else{
                  project.currentStatus = 0;
                }

                project.lastBackup = Date();
                project.save();
              })
            });
          }else{
            git.clone(function(err, output){
              if(err){
                console.log(err);
                project.currentStatus = 1;
                project.failedBackups += 1;
              }else{
                project.currentStatus = 0;
              }
              project.lastBackup = Date();
              project.save();
            });
          }
        });
      });
    });
  }, this.interval);
}

jobProcessor.prototype.isAlive = function(cb){
  cb(null, this.running);
}

module.exports = jobProcessor;
