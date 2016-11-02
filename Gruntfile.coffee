module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    coffee:
      glob_to_multiple:
        expand: true
        cwd: 'src'
        src: ['**/*.coffee']
        dest: 'lib'
        ext: '.js'

    babel:
        options:
            sourceMap: true
            presets: ['es2015']
        dist:
            files:
                '.coffee/src/composite-disposable.js': 'src/composite-disposable.js'
                '.coffee/src/disposable.js': 'src/disposable.js'
                '.coffee/src/emitter.js': 'src/emitter.js'
                '.coffee/spec/composite-disposable-spec.js': 'spec/composite-disposable-spec.js'
                '.coffee/spec/disposable-spec.js': 'spec/disposable-spec.js'
                '.coffee/spec/emitter-spec.js': 'spec/emitter-spec.js'

    coffeelint:
      options:
        no_empty_param_list:
          level: 'error'
        max_line_length:
          level: 'ignore'
        indentation:
          level: 'ignore'

      src: ['src/*.coffee']
      test: ['spec/*.coffee']
      gruntfile: ['Gruntfile.coffee']

    shell:
      test:
        command: 'node node_modules/.bin/jasmine-focused --captureExceptions --forceexit .coffee/spec'
        options:
          stdout: true
          stderr: true
          failOnError: true

      'update-atomdoc':
        command: 'npm update grunt-atomdoc donna tello atomdoc'
        options:
          stdout: true
          stderr: true
          failOnError: true

  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-shell')
  grunt.loadNpmTasks('grunt-coffeelint')
  grunt.loadNpmTasks('grunt-babel')
  grunt.loadNpmTasks('grunt-atomdoc')

  grunt.registerTask 'clean', -> require('rimraf').sync('lib')
  grunt.registerTask('lint', ['coffeelint'])
  grunt.registerTask('default', ['babel', 'coffee', 'lint'])
  grunt.registerTask('test', ['babel', 'coffee', 'lint', 'shell:test'])
