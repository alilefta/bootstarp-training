"use strict";

module.exports = function (grunt) {
	require("time-grunt")(grunt);
	require("jit-grunt")(grunt, {
		useminPrepare: "grunt-usemin",
	});
	const sass = require("node-sass");
	grunt.initConfig({
		sass: {
			options: {
				implementation: sass,
			},
			dist: {
				files: {
					"css/styles.css": "css/styles.scss",
				},
			},
		},
		watch: {
			files: "css/*.scss",
			tasks: ["sass"],
		},
		browserSync: {
			dev: {
				bsFiles: {
					src: ["css/*.css", "js/*.js", "*.html"],
				},
				options: {
					watchTask: true,
					server: {
						baseDir: "./",
					},
				},
			},
		},
		copy: {
			html: {
				files: [
					{
						expand: true,
						dot: true,
						cwd: "./",
						src: ["*.html"],
						dest: "dist",
					},
				],
			},
			fonts: {
				files: [
					{
						expand: true,
						dot: true,
						cwd: "node_modules/font-awesome",
						src: ["fonts/*.*"],
						dest: "dist",
					},
				],
			},
		},
		clean: {
			build: {
				src: ["dist/"],
			},
		},
		imagemin: {
			dynamic: {
				files: [
					{
						expand: true,
						dot: true,
						cwd: "./",
						src: ["img/*.{png, jpg, gif}"],
						dest: "dist/",
					},
				],
			},
		},
		useminPrepare: {
			foo: {
				dest: "dist",
				src: ["contactus.html", "aboutus.html", "index.html"],
			},
			options: {
				flow: {
					steps: {
						css: ["cssmin"],
						js: ["uglify"],
					},
					post: {
						css: [
							{
								name: "cssmin",
								createConfig: function (context, block) {
									let generated = context.options.generated;
									generated.options = {
										keepSpecialComments: 0,
										rebase: false,
									};
								},
							},
						],
					},
				},
			},
		},
		concat: {
			options: {
				separator: ";",
			},
			dist: {},
		},
		uglify: {
			dist: {},
		},
		cssmin: {
			dist: {},
		},
		// This module allows developer to overwrite the user's version of the main.js && main.css which could be saved by browser cache api
		// File revision It will add a hash or version number to the name of main.css and main.js to keep track of versions
		filerev: {
			options: {
				encoding: "utf8",
				algorithm: "md5",
				length: 20,
			},
			release: {
				files: [
					{
						src: ["dist/js/*.js", "dist/css/*.css"],
					},
				],
			},
		},
		usemin: {
			html: ["dist/aboutus.html", "dist/contactus.html", "dist/index.html"],
			options: {
				assetsDirs: ["dist", "dist/css", "dist/js"],
			},
		},
		htmlmin: {
			dist: {
				options: {
					collapseWhitespace: true,
				},
				files: {
					"dist/index.html": "dist/index.html",
					"dist/aboutus.html": "dist/aboutus.html",
					"dist/contactus.html": "dist/contactus.html",
				},
			},
		},
	});
	grunt.registerTask("css", ["sass"]);
	grunt.registerTask("default", ["browserSync", "watch"]);
	grunt.registerTask("build", [
		"clean",
		"copy",
		"imagemin",
		"useminPrepare",
		"concat",
		"cssmin",
		"uglify",
		"filerev",
		"usemin",
		"htmlmin",
	]);
};
