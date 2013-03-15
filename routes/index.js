models = require('../lib/models');

/*
 * GET home page.
 */

exports.index = function(req, res){
  var Project = new models.Project();
  Project.getEnabled(function(err, projects){
    res.render('index', { projects_total: "1,004343", projects: projects} )
  });
};

exports.add = function(req, res){
  if(req.method == "GET"){
    res.render('addProject', {});
  }else if(req.method == "POST"){
    var project = new models.Project();
    project.name = req.body.repoName;
    project.URI = req.body.repoURI;
    project.save(function(err) {
      if(err){
        res.render('addProject', { saveError: err});
      }else{
        project.getEnabled(function(err, projects){
          res.render('index', {projects: projects, projects_total: "+1"});
        });
      }
    });
  }
}

exports.view = function(req, res){
  var Project = new models.Project();
  if(req.params.id){
    Project.get(req.params.id, function(err, project) {
      res.render('viewProject', {project: project});
    });
  }
}

exports.delete = function(req, res){
  var Project = new models.Project();
  if(req.params.id){
  Project.delete(req.params.id, function(err, result) {
      res.json({status: err});
    });
  }
}

exports.getBundle = function(req, res){
  var Project = new models.Project();
  Project.get(req.params.id, function(err, project) {
    res.sendfile(project.bundlePath);
  });

}

