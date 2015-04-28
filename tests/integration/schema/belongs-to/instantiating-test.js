import Mirage from 'ember-cli-mirage';
import Model from 'ember-cli-mirage/orm/model';
import Schema from 'ember-cli-mirage/orm/schema';
import Db from 'ember-cli-mirage/orm/db';
import {module, test} from 'qunit';

var schema, link;
module('mirage:integration:schema:belongsTo instantiating with params', {
  beforeEach: function() {
    var db = new Db();
    db.loadData({
      users: [
        {id: 1, name: 'Link'}
      ],
      addresses: []
    });
    schema = new Schema(db);

    var User = Model.extend();
    var Address = Model.extend({
      user: Mirage.belongsTo()
    });

    schema.register('user', User);
    schema.register('address', Address);

    link = schema.user.find(1);
  }
});

test('it accepts a saved parents id', function(assert) {
  var address = schema.address.new({user_id: 1});

  assert.equal(address.user_id, 1);
  assert.deepEqual(address.user, link);
  assert.deepEqual(address.attrs, {user_id: 1});
});

test('it accepts a null parent id', function(assert) {
  var address = schema.address.new({user_id: null});

  assert.equal(address.user_id, null);
  assert.deepEqual(address.user, null);
  assert.deepEqual(address.attrs, {user_id: null});
});

test('it accepts a saved parent model', function(assert) {
  var address = schema.address.new({user: link});

  assert.equal(address.user_id, 1);
  assert.deepEqual(address.user, link);
  assert.deepEqual(address.attrs, {user_id: 1});
});

test('it accepts a new parent model', function(assert) {
  var zelda = schema.user.new({name: 'Zelda'});
  var address = schema.address.new({user: zelda});

  assert.equal(address.user_id, null);
  assert.deepEqual(address.user, zelda);
  assert.deepEqual(address.attrs, {user_id: null});
});

test('it accepts a null parent model', function(assert) {
  var address = schema.address.new({user: null});

  assert.equal(address.user_id, null);
  assert.deepEqual(address.user, null);
  assert.deepEqual(address.attrs, {user_id: null});
});

test('it accepts a parent model and id', function(assert) {
  var address = schema.address.new({user: link, user_id: 1});

  assert.equal(address.user_id, 1);
  assert.deepEqual(address.user, link);
  assert.deepEqual(address.attrs, {user_id: 1});
});

test('it accepts no reference to a parent id or model', function(assert) {
  var address = schema.address.new({});

  assert.equal(address.user_id, null);
  assert.deepEqual(address.user, null);
  assert.deepEqual(address.attrs, {user_id: null});
});
