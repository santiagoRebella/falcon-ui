(function () {
	
	var app = angular.module('app.services', []);
	
	app.factory('Falcon', ["$http", function($http) {
		
		var Falcon = {},
			USER_ID = 'dashboard';

	    function add_user(url) {
			var paramSeparator = (url.indexOf('?') != -1) ? '&' : '?';
			return url + paramSeparator + 'user.name=' + USER_ID;
	    }

		Falcon.getServerVersion = function () {   
		    return $http.get(add_user('/api/admin/version'));  
		};
		Falcon.getServerStack = function () {   
            return $http.get(add_user('/api/admin/stack'));  
        };
	    return Falcon;
	    
	}]);
	
	app.factory('XMLEntity', ["$http", function($http) {
		
		var x2js = new X2JS(),
		    XMLEntity = {};
		
		XMLEntity.json = null;
	
		
		
		//----------------xml json parse methods---------------//
		XMLEntity.xml_str2json = function (string) {
			return x2js.xml_str2json( string );
		};
		
		
		//-----------------------------------------------------//
		XMLEntity.identifyEntityType = function () {
			
			if(XMLEntity.json.feed !== undefined) {
				XMLEntity.type = "FEED";
				console.log(XMLEntity.json.feed);
			}
			else if(XMLEntity.json.cluster !== undefined) {
				XMLEntity.type = "CLUSTER";
				console.log(XMLEntity.json.cluster);
			}
			else if(XMLEntity.json.process !== undefined) {
				XMLEntity.type = "PROCESS";
				console.log(XMLEntity.json.process);
			}
			else {
				XMLEntity.type = 'Type not recognized';
			}
			
		};
		XMLEntity.validateEntity = function () {
			
			if(XMLEntity.type === "FEED") {
				if( XMLEntity.json.feed.ACL !== undefined && XMLEntity.json.feed.clusters !== undefined && XMLEntity.json.feed.frequency !== undefined && XMLEntity.json.feed.tags !== undefined && XMLEntity.json.feed.groups !== undefined && XMLEntity.json.feed.locations !== undefined && XMLEntity.json.feed.schema !== undefined) {
					console.log('valid feed xml');
					XMLEntity.valid = true;
				}
				else {
					console.log('incomplete feed xml');
					XMLEntity.valid = false;
				}
			}
			else if(XMLEntity.type === "CLUSTER") {
				if( XMLEntity.json.cluster.interfaces !== undefined && XMLEntity.json.cluster.locations !== undefined ) {
					console.log('valid cluster xml');
					XMLEntity.valid = true;
				}
				else {
					console.log('incomplete cluster xml');
					XMLEntity.valid = false;
				}
			}
			else if(XMLEntity.type === "PROCESS") {
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
	
		
})();
