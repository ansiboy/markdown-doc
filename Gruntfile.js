module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        copy: {
            dist: {
                files: [
                    { expand: true, cwd: "dist", src: "*.js", dest: "docs/js/maishu-markdonw-doc/dist" }
                ]
            }
        }
    })

    grunt.registerTask('default', ['shell', "requirejs"]);
}