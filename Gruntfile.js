module.exports = function(grunt) {

	grunt.initConfig({  
		copy: {
		    main: {
                cwd: 'dev/',
		        src: ['js/**','html/*','index.html', 'css/main.css', 'css/fonts/*'],
		        dest: 'prod/',
		        expand: true
		    }
		},
		scp: {
		    options: {
		        host: '127.0.0.1',
		        username: 'root',
		        password: 'hadoop',
		        port: 2222
		    },
		    sandbox: {
		        files: [{
					cwd: 'prod',
		            src: '**',
		            filter: 'isFile',
		           
		            // path on the server
		            dest: '/var/lib/falcon/webapp/falcon'
		        }]
		    }
		},  
        uglify: {
            options: {
                beautify: false,
                mangle: true,
                compress: true, 
                preserveComments: false,
                drop_console: false,
                sourceMap: "dist/application.map",
                banner: "/**** Created by Santiago Rebella ***/"
            },
            main: {                             
                src: "js/main.js",              
                dest: "prod/js/main.min.js"     
            }                                   
        },
        jshint: {
            options: {
                eqeqeq: true,
                curly: true,
                undef: false,
                unused: true
            },
            target: {
                src: [ 
                    "*.js",
	                "dev/js/*.js", 
	                "dev/js/**/*.js",
	                "!dev/js/lib/*.js"
                ]
            }
        },       
        csslint: {
            strict: {                    
                src: ["public/css/*.css"]
            }
        },
        
        datauri: {
		    "default": {
		        options: {
		            classPrefix: "data-"
		        },
		        src: [
		            "css/img/*.png",
		            "css/img/*.gif",
		            "css/img/*.jpg",
		            "css/img/*.bmp"
		        ],
		        dest: [
		            "tmp/base64Images.css"
		        ]
		    }
        },
        less: {
            development: {
                options: {
                    compress: true,
                    yuicompress: false,
                    optimization: 2,
                    cleancss:false,    
                    syncImport: false,
                    strictUnits:false,
                    strictMath: true,
                    strictImports: true,
                    ieCompat: false    
                },
                files: {
                    "dev/css/main.css": "dev/css/main.less"
                }
            }
        },
        watch: {
            livereload: {
              options: { livereload: true },
              files: [
                  "dev/css/main.css", 
                  "dev/html/*.html", 
                  "dev/js/*.js", 
                  "dev/js/**/*.js"
              ]
            },
   //         scripts: {
   //             files: [
   //                 "dev/js/*.js",
   //                 "dev/js/**/*.js"
   //             ],
   //             tasks: ["jshint"]
   //         },
            less: {
                files: ["dev/css/*.less", "dev/css/less/*.less"],
                tasks: ["less", "csslint"], 
                options: {
                    nospawn: true
                }
            }/*,
            express: {
				files:  [ 'server.js' ],
				tasks:  [ 'express:dev' ],
				options: {
					spawn: false
					
				}
			}*/
        },
        express: {
			server: {
				options: {
					script: 'server.js'
				}
			}
			
		}
    });

    grunt.registerTask("default", ["express","watch"]); // van en orden primero el primero    
	
	grunt.registerTask("deploy", ["copy","scp"]);
	
	// grunt.registerTask("livedeploy", ["copy","scp"]); --- i need more time on this to configure it to listen changes and deploy auto
	
    grunt.registerTask("data64", ["datauri"]);

    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-csslint");    
    grunt.loadNpmTasks("grunt-contrib-copy");  
    grunt.loadNpmTasks('grunt-scp'); 
    grunt.loadNpmTasks('grunt-express-server'); 
    grunt.loadNpmTasks('grunt-datauri');
};
