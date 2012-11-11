var Git = require('./lib/git');

var git = new Git();

git.uri = "https://github.com/jdpaton/craft"
git.dir = "/tmp/foobarx"

//git.clone(function(err){
//  console.log(err);
//});

//git.getHead(function(err, head){
//  console.log(head);
//});

//git.bundle('/tmp/cakebundle', function(err){
//  console.log(err);
//});

git.repoExists(function(err, exists){
  console.log(exists);
});


