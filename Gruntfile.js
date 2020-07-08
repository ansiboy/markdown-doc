module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        copy: {
            dist: {
                files: [
                    { expand: true, cwd: "dist", src: "*.js", dest: "docs/js/maishu-markdonw-doc/dist" },
                    { expand: true, cwd: "out", src: "*.js", dest: "docs/js/maishu-markdonw-doc/out" }
                ]
            }
        }
    })

    grunt.registerTask('default', ['shell', "requirejs"]);
}