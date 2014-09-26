(function () {
  "use strict";

  var express = require('express');
  var port = 3000;
  var app = express();
  app.use('/', express.static(__dirname + '/dist'));
  app.use('/app', express.static(__dirname + '/app'));

  buildMockApi(app, '/app/test/resources/api/');
  app.listen(port);
  console.log('Dev server listening on port ' + port);

  function buildMockApi(server, baseApiDir) {
    var file = require('file');
    var baseApiPath = __dirname + baseApiDir;
    file.walkSync(baseApiPath, function (dir, dirs, files) {
      addDirToApi(dir, files, server, baseApiPath);
    });
  }

  function addDirToApi(dir, files, server, baseDirPath) {
    for (var i = 0, n = files.length; i < n; i++) {
      addFileToApi(files[i], dir, server, baseDirPath);
    }
  }

  function addFileToApi(file, dir, server, baseDirPath) {
    if (/get.json$/.test(file)) {
      var jsonContent = require(dir + '/' + file);
      server.get('/api/' + dir.split(baseDirPath)[1], function (req, res) {
        res.json(jsonContent);
      });
    }
  }

})();
