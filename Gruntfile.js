module.exports = function (grunt) {

  grunt.initConfig({
    copy: {
      resources: {
        cwd: 'app',
        src: ['views/*.html', 'index.html', 'styles/fonts/*'],
        dest: 'dist/',
        expand: true
      },

      dependencies: {
        cwd: 'app/',
        src: ['scripts/lib/**', 'styles/fonts/*'],
        dest: 'dist/',
        expand: true
      }
    },

    uglify: {
      options: {
        beautify: false,
        mangle: true,
        compress: true,
        preserveComments: false,
        drop_console: false,
        sourceMap: 'dist/application.map',
        banner: '/**** Created by Santiago Rebella ***/'
      },
      main: {
        files: {
          'dist/scripts/main.min.js': ['app/scripts/**/*.js', '!app/scripts/lib/*.js']
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
          '*.js',
          'app/scripts/*.js',
          'app/scripts/**/*.js',
          '!app/scripts/lib/*.js'
        ]
      }
    },

    csslint: {
      strict: {
        src: ['dist/styles/*.css']
      }
    },

    datauri: {
      'default': {
        options: {
          classPrefix: 'data-'
        },
        src: [
          'styles/img/*.png',
          'styles/img/*.gif',
          'styles/img/*.jpg',
          'styles/img/*.bmp'
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
          'dist/styles/main.css': 'app/styles/main.less'
        }
      }
    },

    watch: {

      less: {
        files: ['app/styles/*.less', 'app/styles/less/*.less'],
        tasks: ['less', 'csslint'],
        options: {
          nospawn: true
        }
      },

      resources: {
        options: {
          livereload: true
        },
        files: ['app/views/*', 'app/index.html', 'app/styles/fonts/*'],
        tasks: ['resources']
      },

      source: {
        options: {
          livereload: true
        },
        files: ['app/scripts/**/*.js'],
        tasks: ['jshint', 'uglify']
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
        files: [{
          cwd: 'dist',
          src: '**',
          filter: 'isFile',

          // path on the server
          dest: '/var/lib/falcon/webapp/falcon'
        }]
      }
    }
  });

  grunt.registerTask('resources', ['copy:resources']);
  grunt.registerTask('dependencies', ['copy:dependencies']);
  grunt.registerTask('default', ['clean', 'uglify', 'less', 'resources', 'dependencies', 'express', 'watch']);
  grunt.registerTask('data64', ['datauri']);

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
};
