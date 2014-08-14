module.exports = function(grunt)
{
	grunt.registerTask(
		'default', 
		'Default task to build all the game code', [
			'clean:js',
			'jshint',
			'uglify:release',
			'clean:css',
			'less:release',
			'libs',
			'update-bower-file'
		]
	);

	grunt.registerTask(
		'dev',
		'Development mode to build the game',
		['watch']
	);

	grunt.registerTask(
		'clean-all',
		'Remove all build files and components',
		['clean']
	);
	
	grunt.registerTask(
		'clean-components',
		'Remove all the bower components',
		['clean:components']
	);

	grunt.registerTask(
		'libs', 
		'Import external client-side dependencies using Bower', [
			'clean:libraries',
			'bower:install', 
			'uglify:libraries', 
			'less:libraries'
		]
	);

	grunt.registerTask(
		'libs-debug',
		'Import using Bower and build debug versions of libraries', [
			'bower:install', 
			'uglify:libraries-debug', 
			'less:libraries-debug'
		]
	);

	grunt.registerTask(
		'update-bower-file',
		'Update the bower file with the build version',
		function()
		{	
			// Get the paths and files
			var bowerPath = process.cwd() + '/bower.json',
				bower = grunt.file.readJSON(bowerPath),
				build = grunt.file.readJSON(process.cwd() + '/build.json');

			// Update the bower version
			bower.version = build.version;
			bower.name = build.name;

			// Write the bower file
			grunt.file.write(bowerPath, JSON.stringify(bower, null, "\t"));
		}
	);
};
