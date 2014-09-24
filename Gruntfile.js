module.exports = function (grunt) {

  grunt.initConfig({
    copy: {
      main: {
        cwd: 'app/',
        src: ['scripts/**', 'views/*', 'index.html', 'styles/main.css', 'styles/fonts/*'],
        dest: 'dist/',
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
        files: [
          {
            cwd: 'dist',
            src: '**',
            filter: 'isFile',

            // path on the server
            dest: '/var/lib/falcon/webapp/falcon'
          }
        ]
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
        src: "scripts/main.js",
        dest: "dist/scripts/main.min.js"
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
          "app/scripts/*.js",
          "app/scripts/**/*.js",
          "!app/scripts/lib/*.js"
        ]
      }
    },
    csslint: {
      strict: {
        src: ["public/styles/*.css"]
      }
    },

    datauri: {
      "default": {
        options: {
          classPrefix: "data-"
        },
        src: [
          "styles/img/*.png",
          "styles/img/*.gif",
          "styles/img/*.jpg",
          "styles/img/*.bmp"
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
          cleancss: false,
          syncImport: false,
          strictUnits: false,
          strictMath: true,
          strictImports: true,
          ieCompat: false
        },
        files: {
          "app/styles/main.css": "app/styles/main.less"
        }
      }
    },
    watch: {
      livereload: {
        options: { livereload: true },
        files: [
          "app/styles/main.css",
          "app/styles/*.html",
          "app/styles/*.js",
          "app/styles/**/*.js"
        ]
      },
      less: {
        files: ["app/styles/*.less", "app/styles/less/*.less"],
        tasks: ["less", "csslint"],
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

    }
  });

  grunt.registerTask("default", ["express", "watch"]);

  grunt.registerTask("deploy", ["copy", "scp"]);

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
