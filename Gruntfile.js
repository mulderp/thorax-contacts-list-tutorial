module.exports = function(grunt) {
  var request = require('request');
  var port = 8000,
      publicDir = './public',
      jsDir = publicDir + '/modules',
      lumbarFile = './lumbar.json',
      hostname = 'localhost';
  
  grunt.file.mkdir(publicDir);
  grunt.file.mkdir(jsDir);

  grunt.initConfig({
    // create a static webserver
    connect: {
      server: {
        options: {
          hostname: hostname,
          base: publicDir,
          port: port,
          logger: 'dev',
          middleware: function(connect, options) {
            var config = [
              // Serve static files.
              connect.static(options.base),
              // Make empty directories browsable.
              connect.directory(options.base)
              ];

              config.unshift(function(req, res, next) {
                if (req.url.indexOf('/api/') == 0) {
                  req.pipe(request('http://localhost:8080' + req.url.slice(4))).pipe(res);
                }
                else
                {
                  next();
                }
              });

              if (options.logger) {
                config.unshift(connect.logger(options.logger));
              }

              return config;
            }
        }
      },
    },
    lumbar: {
      // performs an initial build so when tests
      // and initial open are run, code is built
      init: {
        build: lumbarFile,
        output: jsDir
      },
      // a long running process that will watch
      // for updates, to include another long
      // running task such as "watch", set
      // background: true
      watch: {
        background: false,
        watch: lumbarFile,
        output: jsDir
      }
    },
    // allows files to be opened when the
    // Thorax Inspector Chrome extension
    // is installed
    thorax: {
      inspector: {
        background: true,
        editor: "subl",
        paths: {
          views: "./js/views",
          models: "./js/models",
          collections: "./js/collections",
          templates: "./templates"
        }
      }
    }
  });
  
  grunt.registerTask('open-browser', function() {
    var open = require('open');
    open('http://' + hostname + ':' + port);
  });
  
  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('thorax-inspector');
  grunt.loadNpmTasks('lumbar');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('default', [
    'thorax:inspector',
    'lumbar:init',
    'connect:server',
    'open-browser',
    'lumbar:watch'
  ]);
};
