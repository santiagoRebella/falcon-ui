(function () {
	"use strict";
	
    var express = require('express'),
        appDev = express(),
        appProd = express();
    
    appDev.use(express.static(__dirname+'/app'));
    appDev.listen(3000);
    
	appProd.use(express.static(__dirname+'/prod'));    
    appProd.listen(3100);
    
    console.log('Prod server listening on port 3100 \n Dev server listening on port 3000');
	 
})();
