var mongoose = require('mongoose');

var db = mongoose.createConnection('localhost', 'github-backups', function(err){
   if(err) {
     console.error('error connecting to mongodb, is it running?');
     console.error(err);
     process.exit(1);
   }
});


module.exports = db;

