import utils from 'ember-cli-mirage/shorthands/utils';
import Db from 'ember-cli-mirage/orm/db';

import {module, test} from 'qunit';

var request;
module('mirage:shorthands#utils', {
  beforeEach: function() {
    request = { params: {id: ''} };
  }
});

test('it returns a number if it\'s a number', function(assert) {
  request.params.id = 2;
  assert.equal(utils.getIdForRequest(request), 2, 'it returns a number');
});

test('it returns a number if it\'s a string represented number', function(assert) {
  request.params.id = "2";
  assert.equal(utils.getIdForRequest(request), 2, 'it returns a number');
});

test('it returns a string it\'s a dasherized number', function(assert) {
  request.params.id = "2-1";
  assert.equal(utils.getIdForRequest(request), "2-1", 'it returns a number');
});

test('it returns a string if it\'s a string', function(assert) {
  request.params.id = "someID";
  assert.equal(utils.getIdForRequest(request), "someID", 'it returns a number');
});
