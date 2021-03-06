module.exports = function (grunt) {

  grunt.initConfig({
    copy: {
      resources: {
        cwd: 'app',
        src: ['html/**/*.html', 'index.html', 'css/fonts/*'],
        dest: 'dist/',
        expand: true
      },

      dependencies: {
        cwd: 'app/',
        src: ['js/lib/*.js', 'css/fonts/*', 'css/img/*'],
        dest: 'dist/',
        expand: true
      },
      
      falcon : {
        cwd: 'app/',
        src: ['falcon/**'],
        dest: 'dist/',
        expand: true
      }
    },

    uglify: {
      options: {
        beautify: true,
        mangle: true,
        compress: true,
        preserveComments: false,
        drop_console: false,
        sourceMap: true,
        banner: '/**** Apache Falcon UI ***/'
      },
      main: {
        files: {
          'dist/js/main.min.js': [
            'app/js/controllers/feed/feed-module.js',
            'app/js/controllers/**/*.js',
            'app/js/directives/*.js',
            'app/js/services/*.js',
            'app/js/util/*.js',
            'app/js/app.js'
          ]
        }
      }
    },

    jshint: {
      options: {
        eqeqeq: true,
        curly: true,
        undef: false,
        unused: true,
        force: true
      },
      target: {
        src: [
          'app/js/app.js',
          'app/js/controllers/**/*.js',
          'app/js/directives/*.js',
          'app/js/services/*.js',
          'app/js/util/*.js'
        ]
      }
    },

    csslint: {
      strict: {
        src: ['dist/css/*.css']
      }
    },

    datauri: {
      'default': {
        options: {
          classPrefix: 'data-'
        },
        src: [
          'css/img/*.png',
          'css/img/*.gif',
          'css/img/*.jpg',
          'css/img/*.bmp'
        ],
        dest: [
          'tmp/base64Images.css'
        ]
      }
    },

    less: {
      development: {
        options: {
          compress: true,
          yuicompress: false,
          optimization: 2,
          cleancss: false,
          syncImport: false,
          strictUnits: false,
          strictMath: true,
          strictImports: true,
          ieCompat: false
        },
        files: {
          'dist/css/main.css': 'app/css/main.less'
        }
      }
    },

    watch: {
      less: {
        files: ['app/css/*.less', 'app/css/less/*.less'],
        tasks: ['less'],
        options: {
          nospawn: true,
          livereload: true
        }
      },
      resources: {
        options: {
          livereload: true
        },
        files: ['app/html/**/*.html', 'app/index.html', 'app/css/fonts/*'],
        tasks: ['resources']
      },

      source: {
        options: {
          livereload: true
        },
        files: ['app/js/**/*.js', 'app/test/**/*Spec.js'],
        tasks: ['jshint', 'karma:unit:run', 'uglify']
      }
    },

    express: {
      server: {
        options: {
          script: 'server.js'
        }
      }
    },

    clean: ["dist"],

    scp: {
      options: {
        host: '127.0.0.1',
        username: 'root',
        password: 'hadoop',
        port: 2222
      },

      sandbox: {
        files: [
          {
            cwd: 'dist',
            src: '**',
            filter: 'isFile',
            // path on the server
            dest: '/usr/hdp/2.2.0.0-913/falcon/webapp/falcon/'
          }
        ]
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js',
        background: true,
        singleRun: false,
        autoWatch: false
      },

      continuous: {
        configFile: 'karma.conf.js',
        singleRun: true,
        autoWatch: false,
        browsers: ['PhantomJS']
      }
    }

  });

  grunt.registerTask('resources', ['copy:resources']);
  grunt.registerTask('dependencies', ['copy:dependencies']);
  grunt.registerTask('test', ['karma:continuous']);
  grunt.registerTask('build', ['clean', 'uglify', 'less', 'resources', 'dependencies']);
  grunt.registerTask('w', ['build', 'karma:unit:start', 'watch']);
  grunt.registerTask('server', ['express', 'w']);
  grunt.registerTask('default', ['server']);
  grunt.registerTask('data64', ['datauri']);
  
  grunt.registerTask('dev', ['server', 'test']);

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-scp');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-datauri');
  grunt.loadNpmTasks('grunt-karma');

};
