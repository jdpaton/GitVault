models = require('../lib/models');

/*
 * GET home page.
 */

exports.index = function(req, res){
  models.Project.find(function(err, projects){
    res.render('index', { projects_total: "1,004343", projects: projects} )
  });
};

exports.add = function(req, res){
  if(req.method == "GET"){
    res.render('addProject', {});
  }else if(req.method == "POST"){
    project = new models.Project();
    project.name = req.body.repoName;
    project.URI = req.body.repoURI;
    project.save(function(err) {
      if(err){
        res.render('addProject', { saveError: err});
      }else{
        models.Project.find(function(err, projects){
          res.render('index', {projects: projects, projects_total: "+1"});
        });
      }
    });
  }
}

exports.view = function(req, res){
  if(req.params.id){
    models.Project.findOne({_id: req.params.id}, function(err, project) {
      res.render('viewProject', {project: project});
    });
  }
}

exports.delete = function(req, res){
  if(req.params.id){
    models.Project.remove({_id: req.params.id}, function(err) {
      var code;
      if(err) {
        code = 1;
      }else{
        code = 0;
      }
      res.json({status: code});
    });
  }
}

exports.getBundle = function(req, res){

  models.Project.findOne({_id: req.params.id}, function(err, project) {
   res.sendfile(project.bundlePath);
  });

}

