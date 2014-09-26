(function () {
    "use strict";

    var express = require('express');
    var app = express();

    app.use('/', express.static(__dirname + '/dist'));
    app.use('/app', express.static(__dirname + '/app'));
    app.listen(3000);

    console.log('Dev server listening on port 3000');

})();
