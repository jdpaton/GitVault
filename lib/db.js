var dbname = 'gitvault';

var db = function(adapter){

  switch(adapter){
    case 'mongodb':
      var mongoose = require('mongoose');
      dbadapter = mongoose.createConnection('localhost', dbname, function(err){
                     if(err) {
                       console.error('error connecting to mongodb, is it running?');
                       console.error(err);
                       process.exit(1);
                     }
                  });
      break;
    case 'rethinkdb':
      var rethink = require('rethinkdb');
      dbadapter = rethink;
      rethink.connect({ host: 'localhost', port: 28015 }, function(conn) {
        rethinkdb.dbCreate(dbname).run();
        rethink.db(dbname).tableCreate('projects').run();
        conn.use(dbname);
        dbadapter = rethink;

      });
      break;
    default:
      return new Error('Database: ' + adapter + ' is not supported');
  }

  return dbadapter;

}

module.exports = db;

