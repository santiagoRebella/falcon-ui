(function () {
  "use strict";

  var express = require('express');
  var app = express();

  app.use(express.static(__dirname + '/dev'));
  app.listen(3000);

  console.log('Dev server listening on port 3000');

})();
