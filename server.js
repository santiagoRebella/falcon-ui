(function () {
    "use strict";

    var express = require('express');
    var app = express();

    app.use('/', express.static(__dirname + '/dist'));
    app.use('/app', express.static(__dirname + '/app'));

    app.get('/api/admin/version', function(req, res){
        var data = require(__dirname + '/app/test/resources/api/admin/version.json');
        res.json(data);
    });


    app.listen(3000);


    console.log('Dev server listening on port 3000');

})();
