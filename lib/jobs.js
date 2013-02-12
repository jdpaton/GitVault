require('sugar');

var conf = require('./config');
var mailer = require('./mailer');
var path = require('path');
var Git = require('./git');
var models = require('./models');

var jobProcessor = function(opts){

  this.interval = conf.get('job_interval') * 1000;
  this.repoDir = conf.get('repo_dir');
  this.running = false;

}

jobProcessor.prototype.start = function(){
  var self = this;
  this.runner = setInterval(function(){
    self.running = true;

    var Project = new models.Project();

    Project.getEnabled(function(err, projects){
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
                  project.currentStatus = 1;
                  project.failedBackups += 1;
                  project.errorLog = output;

                  mailer.sendMail({
                    subject: "Failed to update remote repository: " + project.URI,
                    text: "An error occured while trying to update the remote repository\n\n " +
                          project.URI + "\n\n" +
                          err.message
                  }, function(err, result){
                    console.error(err, result);
                  });

                }else{
                  project.currentStatus = 0;
                  project.errorLog = null;
                }

                project.lastBackup = Date();
                git.lastLog(function(err, log){
                  project.lastLog = log;
                  project.save(function(err, result){});
                })
              })
            });
          }else{
            git.clone(function(err, output){
              if(err){
                project.currentStatus = 1;
                project.failedBackups += 1;
                project.errorLog = err.message;

                mailer.sendMail({
                  subject: "Failed to clone new repository: " + project.URI,
                  text: "An error occured while trying to clone a new repository\n\n " +
                        project.URI + "\n\n" +
                        err.message
                }, function(err, result){
                  console.error(err, result);
                });

              }else{
                project.currentStatus = 0;
                project.errorLog = null;
              }
              project.lastBackup = Date();
              project.save(function(err, result){});
            });
          }
        });
      });
    });
  }, this.interval);
  console.log("Background job runner activated");
}

jobProcessor.prototype.isAlive = function(cb){
  cb(null, this.running);
}

jobProcessor.prototype.stop = function(cb){
  if(this.running){
    clearInternal(this.runner);
    return cb(null);
  }else{
    return cb(new Error("Not running"));
  }
}

module.exports = jobProcessor;
