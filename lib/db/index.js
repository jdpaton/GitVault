var dbname = 'gitvault';

var db = function(adapter){

  switch(adapter){
    case 'mongodb':
      adapter = require('./adapters/mongodb.js');
      adapter = new adapter({dbname: dbname});
      adapter.connect();
      break;
    case 'rethinkdb':
      adapter = require('./adapters/rethinkdb.js');
      adapter = new adapter({dbname: dbname});
      adapter.connect();
      break;
    case 'couchdb':
      adapter = require('./adapters/couchdb.js');
      adapter = new adapter({dbname: dbname});
      adapter.connect(function(err){
        if(err) return new Error(err);
      });
      break;
    default:
      return new Error('Database: ' + adapter + ' is not supported');
  }

  return adapter;

}

module.exports = db;

