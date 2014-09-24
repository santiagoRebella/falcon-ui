module.exports = function (grunt) {

  grunt.initConfig({
    copy: {
      main: {
        cwd: 'app/',
        src: ['views/*', 'index.html', 'styles/fonts/*', 'scripts/lib/**'],
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
        unused: true
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
      livereload: {
        options: {
          livereload: true
        },
        files: [
          'app/styles/main.css',
          'app/styles/*.html',
          'app/styles/*.js',
          'app/styles/**/*.js'
        ],
        tasks: ['copy']
      },

      less: {
        files: ['app/styles/*.less', 'app/styles/less/*.less'],
        tasks: ['csslint', 'less'],
        options: {
          nospawn: true
        }
      }
    },

    express: {
      server: {
        options: {
          script: 'server.js'
        }
      }

    },

    clean: ["dist"]
  });

  grunt.registerTask('lint', ['jshint', 'less', 'csslint']);

  grunt.registerTask('default', ['clean', 'uglify', 'less', 'copy', 'express', 'watch']);
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
