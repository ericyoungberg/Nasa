var lrSnippet = require('connect-livereload')({port: 35729});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

var sourceset = require('sourceset');

var packageFiles = ['bower.json', 'package.json'];

module.exports = function(grunt) {

	//Load all grunt tasks required
	require('load-grunt-tasks')(grunt);

	//Configuration
	var portConfig = {
		site: '.',
		port: 8000
	};


	grunt.initConfig({

		watch: {
			options: {
				livereload: true
			},
			js: {
				files: ['lib/*.js', 'lib/**/*.js'],
				tasks: ['babel:dist', 'browserify:local']
			}
		},

		connect: {
			options: {
				port: portConfig.port,
				hostname: 'localhost',
			},
			livereload: {
				middleware: function(connect) {
					return [
						lrSnippet,
						mountFolder(connect, portConfig.site)
					];
				}
			}
		},

		open: {
			server: {
				path: 'http://localhost:'+portConfig.port
			}
		},

		copy: {
      dist: {
        files: [
          {
            expand: true,
            cwd: 'tmp/',
            src: ['Nasa.js'],
            dest: 'dist/'
          }
        ]
      }
		},

    babel: {
      dist: {
        files: sourceset({
          files: ['Nasa.js', 'engine/*.js', 'interface/*.js'],
          src: 'lib',
          dest: 'tmp/lib'
        })
      }
    },

    browserify: {
      local: {
        src: ['tmp/lib/Nasa.js'],
        dest: 'tmp/Nasa.js'
      } 
    },

		uglify: {
			local: {
        options: {
          beautify: false
        },
				files: {
          'dist/Nasa.min.js': 'tmp/Nasa.js'
        }
			}
		},

    version: {
      major: {
        options: {
          release: 'major' 
        },
        src: packageFiles 
      }, 
      minor: {
        options: {
          release: 'minor' 
        },
        src: packageFiles 
      }, 
      patch: {
        options: {
          release: 'patch' 
        },
        src: packageFiles 
      } 
    }

});

  grunt.registerTask('major', function() {
    grunt.task.run([
      'version:major',
      'build'
    ]); 
  });

  grunt.registerTask('minor', function() {
    grunt.task.run([
      'version:minor',
      'build'
    ]); 
  });

  grunt.registerTask('patch', function() {
    grunt.task.run([
      'version:patch',
      'build'
    ]); 
  });

	//Task to start server
	grunt.registerTask('serve', function() {
		grunt.task.run([
      'babel:dist',
      'browserify:local',
			'connect',
			'open',
			'watch'
		]);
	});

  grunt.registerTask('build', function() {
    console.log("Building...");
    grunt.task.run([
      'babel:dist',
      'browserify:local',
      'uglify:local',
      'copy:dist'
    ]);
  });

	//Default task
	grunt.registerTask('default', ['uglify:local', 'concat:dist', 'copy:dist']);

}
