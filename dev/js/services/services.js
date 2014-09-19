(function () {
	
	var app = angular.module('app.services', []);
	
	app.factory('Falcon', ["$http", function($http) {
		
		var Falcon = {
    		    serverResponse: null,
    		    success: null    
    		},
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
           return $http.post(add_user('/api/entities/validate/' + type), xml, { headers: {'Content-Type': 'text/plain'} });  
        };
        Falcon.postSubmitEntity = function (xml, type) {   
           return $http.post(add_user('/api/entities/submit/' + type), xml, { headers: {'Content-Type': 'text/plain'} });  
        };
        Falcon.deleteEntity = function (type, name) {   
           return $http.delete(add_user('api/entities/delete/' + type + '/' + name));  
        };
        Falcon.getEntities = function (type) {   
            return $http.get(add_user('/api/entities/list/' + type +'?fields=:fields'));  
        };
        
        Falcon.getEntityDefinition = function (type, name) {   
            return $http.get(add_user('api/entities/definition/' + type + '/'+ name));  
        };
        
        
        
        //----------------------------------------------//
	    return Falcon;
	    
	}]);
	
	app.factory('EntityModel', ["$http", "X2jsService", function($http, X2jsService) {
		
		var EntityModel = {};
		
		EntityModel.json = null;
		
		EntityModel.identifyType = function(json) {      
            if(json.feed) { EntityModel.type = "feed"; }
            else if(json.cluster) { EntityModel.type = "cluster"; }
            else if(json.process) { EntityModel.type = "process"; }
            else { EntityModel.type = 'Type not recognized'; }            
        };
        EntityModel.getJson = function(xmlString) { 
            EntityModel.json = X2jsService.xml_str2json( xmlString );
            return EntityModel.identifyType(EntityModel.json);  
        };
	    
	    EntityModel.clusterModel = {
           cluster:{  
              interfaces:{  
                 interface:[  
                    {  
                       _type:"readonly",
                       _endpoint:"hftp://sandbox.hortonworks.com:50070",
                       _version:"2.2.0"
                    },
                    {  
                       _type:"write",
                       _endpoint:"hdfs://sandbox.hortonworks.com:8020",
                       _version:"2.2.0"
                    },
                    {  
                       _type:"execute",
                       _endpoint:"sandbox.hortonworks.com:8050",
                       _version:"2.2.0"
                    },
                    {  
                       _type:"workflow",
                       _endpoint:"http://sandbox.hortonworks.com:11000/oozie/",
                       _version:"4.0.0"
                    },
                    {  
                       _type:"messaging",
                       _endpoint:"tcp://sandbox.hortonworks.com:61616?daemon=true",
                       _version:"5.1.6"
                    }
                 ]
              },
              locations:{  
                 location:[  
                    {  
                       _name:"staging",
                       _path:"/apps/falcon/backupCluster/staging"
                    },
                    {  
                       _name:"temp",
                       _path:"/tmp"
                    },
                    {  
                       _name:"working",
                       _path:"/apps/falcon/backupCluster/working"
                    }
                 ]
              },
              _xmlns:"uri:falcon:cluster:0.1",
              _name:"backupCluster",
              _description:"virginiaHadoopCluster",
              _colo:"USEastVirginia"
           }
        };
	    
	    return EntityModel;
	    
	}]);
	
	
	app.factory('X2jsService', ["$http", function($http) {
		
		var x2js = new X2JS(), X2jsService = {};

		X2jsService.xml_str2json = function (string) {
			return x2js.xml_str2json( string );
		};
		X2jsService.json2xml_str = function (jsonObj) {
			return x2js.json2xml_str( jsonObj );
		};

		
	    return X2jsService;
	    
	}]);
	
	app.factory('FileApi', ["$http", "$q", "EntityModel", function($http, $q, EntityModel) {
		
		var FileApi = {};
		
		FileApi.supported = (window.File && window.FileReader && window.FileList && window.Blob);
		FileApi.errorMessage = 'The File APIs are not fully supported in this browser.';
		
		FileApi.fileDetails = "No file loaded";
		FileApi.fileRaw = "No file loaded";
		
		FileApi.loadFile = function (evt) {
			
			var deferred = $q.defer(),
			    reader = new FileReader(), 
				file = evt.target.files[0];
				
	        reader.onload = (function(theFile) {

				reader.readAsText(theFile, "UTF-8");

		        return function(e) {
		            FileApi.fileRaw = e.target.result; 
                    FileApi.fileDetails = theFile;                   
		            EntityModel.getJson(FileApi.fileRaw); 
					deferred.resolve();	
		        };
		        
		    })(file);	
		    
		    return deferred.promise;	
		};
		
		return FileApi; 
	}]);
	
})();
