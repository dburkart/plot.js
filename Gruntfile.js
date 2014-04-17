module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      src: ['lib/main.js', 'lib/interpreter/builtin.js', 'lib/interpreter/grammar.js',
            'lib/interpreter/lexer.js', 'lib/interpreter/parser.js', 'lib/interpreter/token.js',
            'lib/drawing/api.js', 'lib/drawing/canvas.js', 'lib/drawing/graph.js',
            'lib/drawing/svg.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
};
