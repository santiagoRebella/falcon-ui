(function () {
	"use strict";
	
    var express = require('express'),
        appDev = express(),
        appProd = express();
    
    appDev.use(express.static(__dirname+'/dev'));    
    appDev.listen(3000, function () {
		console.log('Dev server listening on port 3000');
    });
    
	appProd.use(express.static(__dirname+'/prod'));    
    appProd.listen(3100, function () {
		console.log('Prod server listening on port 3100');
    });
})();
