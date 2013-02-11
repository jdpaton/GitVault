var path = require('path');
var nconf = require('nconf');

nconf.defaults({
  'webui_port': 3000,
  'job_interval': 300
});

nconf.argv()
     .env()
     .file({ file: path.join(__dirname, '../config/config.json')});

module.exports = nconf;
