(function () {
	
	var app = angular.module('app.services', []);
	
	app.factory('Falcon', ["$http", function($http) {
		
		var Falcon = {},
			USER_ID = 'dashboard';

	    function add_user(url) {
			var paramSeparator = (url.indexOf('?') != -1) ? '&' : '?';
			return url + paramSeparator + 'user.name=' + USER_ID;
	    }
		//----------methods----------------------------//
		Falcon.getServerVersion = function () {   
		    return $http.get(add_user('/api/admin/version'));  
		};
		Falcon.getServerStack = function () {   
            return $http.get(add_user('/api/admin/stack'));  
        };
        Falcon.postValidateEntity = function (xml, type) {   

           // return $http.post(add_user('/api/entities/validate/' + type), xml, {headers: {'Content-Type': 'application/xml'} });  
           return $http({
                        method: "post",
                        url: add_user('/api/entities/validate/' + type),
                        dataType: 'xml',
                        data: xml,
                        headers: {"Content-Type":"text/plain"}
                    });
           
        };
        //----------------------------------------------//
	    return Falcon;
	    
	}]);
	
	app.factory('XMLEntity', ["$http", function($http) {
		
		var XMLEntity = {};
		
		XMLEntity.json = null;
		
		XMLEntity.identifyEntityType = function () {
			
			if(XMLEntity.json.feed !== undefined) {
				XMLEntity.type = "feed";
			}
			else if(XMLEntity.json.cluster !== undefined) {
				XMLEntity.type = "cluster";
			}
			else if(XMLEntity.json.process !== undefined) {
				XMLEntity.type = "process";
			}
			else {
				XMLEntity.type = 'Type not recognized';
			}
			
		};
		XMLEntity.validateEntity = function () {
			
			if(XMLEntity.type === "feed") {
				if( XMLEntity.json.feed.ACL !== undefined && XMLEntity.json.feed.clusters !== undefined && XMLEntity.json.feed.frequency !== undefined && XMLEntity.json.feed.tags !== undefined && XMLEntity.json.feed.groups !== undefined && XMLEntity.json.feed.locations !== undefined && XMLEntity.json.feed.schema !== undefined) {
					console.log('valid feed xml');
					XMLEntity.valid = true;
				}
				else {
					console.log('incomplete feed xml');
					XMLEntity.valid = false;
				}
			}
			else if(XMLEntity.type === "cluster") {
				if( XMLEntity.json.cluster.interfaces !== undefined && XMLEntity.json.cluster.locations !== undefined ) {
					console.log('valid cluster xml');
					XMLEntity.valid = true;
				}
				else {
					console.log('incomplete cluster xml');
					XMLEntity.valid = false;
				}
			}
			else if(XMLEntity.type === "process") {
				if( XMLEntity.json.process.tags !== undefined && XMLEntity.json.process.clusters !== undefined && XMLEntity.json.process.parallel !== undefined && XMLEntity.json.process.order !== undefined && XMLEntity.json.process.frequency !== undefined && XMLEntity.json.process.outputs !== undefined && XMLEntity.json.process.workflow !== undefined && XMLEntity.json.process.retry !== undefined) {
					console.log('valid process xml');
					XMLEntity.valid = true;
				}
				else {
					console.log('incomplete process xml');
					XMLEntity.valid = false;
				}
			}
			else {
				XMLEntity.valid = false;
			}
			
		};	
	    return XMLEntity;
	    
	}]);
	
	
	app.factory('X2jsService', ["$http", function($http) {
		
		var x2js = new X2JS(), X2jsService = {};

		X2jsService.xml_str2json = function (string) {
			return x2js.xml_str2json( string );
		};
		X2jsService.json2xml = function (jsonObj) {
			return x2js.json2xml_str( jsonObj );
		};

		
	    return X2jsService;
	    
	}]);
		
})();
