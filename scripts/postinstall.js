#!/usr/bin/env node

// Check if we should ask for user input
(function(){

	var fs = require('fs'),
		path = require('path'),
		prompt = require('prompt'),
		_ = require('lodash'),
		fileCheck = '.buildFile',
		buildfile = path.resolve(__dirname, '..', '..', '..', 'build.json');

	if (!fs.existsSync(fileCheck))
	{
		gruntDefault();
		return;
	}
	// Get the file path and remove the file
	fs.unlinkSync(fileCheck);

	prompt.start();
	prompt.get([{
			name : 'name',
			description: 'The human-readable name of the project',
			pattern: /^[a-zA-Z\-0-9]+?$/,
			message: "Name can only contain letters, numbers and hyphens",
			required: true
		}, {
			name : 'version',
			description: 'The starting version of the project',
			default: '0.0.1',
			pattern: /^\d+\.\d+(\.\d+)?$/,
			message: "Version must be in the format #.#.#",
			required: true
		}
	], function(err, result){
		if (!err)
		{
			// Get the build file as an object
			var build = fs.readFileSync(buildfile);
			build = JSON.parse(build);

			fs.writeFile(
				buildfile, 
				JSON.stringify(
					_.extend(build, result), null, "\t"
				), 
				gruntDefault
			);
			return;
		}
		// Build the library
		gruntDefault();
	});

	// Do the default grunt build
	function gruntDefault()
	{
		var isWindows = process.platform === 'win32';
		var cwd = path.dirname(buildfile);
		var spawn = require('child_process').spawn;
		var grunt = isWindows ?
			spawn(process.env.comspec, ['/c', 'grunt'], { cwd: cwd }):
			spawn('grunt', [], { cwd: cwd });

		grunt.stdout.on('data', function (data) {
			process.stdout.write(data);
		});

		grunt.stderr.on('data', function (data) {
			process.stdout.write(data);
		});

		grunt.on('error', function(err){
			console.log("Grunt run error", err);
		});
	}
	
}());