var lrSnippet = require('connect-livereload')({port: 35729});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

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
				tasks: ['uglify']
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
          },
          {
            expand: true,
            cwd: 'tmp/',
            src: ['Nasa.min.js'],
            dest: 'dist/'
          }
        ]
      }
		},

		uglify: {
			local: {
        options: {
          beautify: true 
        },
				files: {
          'tmp/Nasa.min.js': [
          'lib/*.js', 
          'lib/**/*.js'
          ]
        }
			}
		}

});

	//Task to start server
	grunt.registerTask('serve', function() {
		grunt.task.run([
			'uglify:local',
			'connect',
			'open',
			'watch'
		]);
	});

  grunt.registerTask('build', function() {
    console.log("Building...");
    grunt.task.run([
      'uglify:local',
      'copy:dist'
    ]);
  });

	//Default task
	grunt.registerTask('default', ['uglify:local', 'copy:dist']);

}
