/* jshint node: true */
/* global require, module */

var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

var app = new EmberAddon();

if (app.env !== 'production') {
  app.import(app.bowerDirectory + '/sinonjs/sinon.js', { type: 'test' } );
  // app.import('vendor/sinon-qunit.js', { type: 'test' } );
}

module.exports = app.toTree();
