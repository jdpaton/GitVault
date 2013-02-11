var path = require('path');
var nconf = require('nconf');

nconf.defaults({
  'webui_port': 3000,
  'job_interval': 30
});

nconf.argv()
     .env()
     .file({ file: path.join(__dirname, '../config/config.json')});

nconf.set('port', nconf.get('webui_port'));

module.exports = nconf;
