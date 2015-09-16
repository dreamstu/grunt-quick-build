module.exports = function(grunt) {
	grunt.loadTasks('../lib/task');

	grunt.initConfig({
		build: {
			options: {
				uglify: true,
				options: {
					global_defs: {
						"DEBUG":true
					}
				}
			},
			main: {
				expand: true,
				cwd: "./src",
				src: ["*/src/**/*.js", "*/src/**/*.tpl", "*/index.js","!*/test/"],
				dest: "./dest",
			}
		}
	});
	grunt.registerTask('default', ['build']);
}