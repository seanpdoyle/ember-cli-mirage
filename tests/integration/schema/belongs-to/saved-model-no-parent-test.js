import Mirage from 'ember-cli-mirage';
import Model from 'ember-cli-mirage/orm/model';
import Schema from 'ember-cli-mirage/orm/schema';
import Db from 'ember-cli-mirage/orm/db';
import {module, test} from 'qunit';

var schema, db, link, address;
module('mirage:integration:schema:belongsTo#saved-model-no-parent', {
  beforeEach: function() {
    db = new Db();
    db.createCollection('users');
    db.users.insert([
      {id: 1, name: 'Link'}
    ]);
    db.createCollection('addresses');
    db.addresses.insert([
      {id: 1, user_id: null}
    ]);
    schema = new Schema(db);

    var User = Model.extend();
    var Address = Model.extend({
      user: Mirage.belongsTo()
    });

    schema.register('user', User);
    schema.register('address', Address);

    link = schema.user.find(1);
    address = schema.address.find(1);
  }
});

// Create
test('it can create a new saved parent model', function(assert) {
  var ganon = address.createUser({name: 'Ganon'});

  assert.ok(ganon.id, 'the parent was persisted');
  assert.deepEqual(address.user, ganon);
  assert.equal(address.user_id, ganon.id);
  assert.deepEqual(address.attrs, {id: 1, user_id: ganon.id});
});

test('it can create a new unsaved parent model', function(assert) {
  var ganon = address.newUser({name: 'Ganon'});

  assert.ok(!ganon.id, 'the parent was not persisted');
  assert.deepEqual(address.user, ganon);
  assert.equal(address.user_id, null);
  assert.deepEqual(address.attrs, {id: 1, user_id: null});
});

// Read
test('it references the model, and its foreign key is correct', function(assert) {
  assert.deepEqual(address.user, null);
  assert.equal(address.user_id, null);
  assert.deepEqual(address.attrs, {id: 1, user_id: null});
});

// Update
test('it can update its relationship to a saved parent via parent_id', function(assert) {
  address.user_id = 1;

  assert.equal(address.user_id, 1);
  assert.deepEqual(address.user, link);
  assert.deepEqual(address.attrs, {id: 1, user_id: 1});
});

test('it can update its relationship to a saved parent via parent', function(assert) {
  address.user = link;

  assert.equal(address.user_id, 1);
  assert.deepEqual(address.user, link);
  assert.deepEqual(address.attrs, {id: 1, user_id: 1});
});

test('it can update its relationship to a new parent via parent', function(assert) {
  var ganon = schema.user.new({name: 'Ganon'});
  address.user = ganon;

  assert.equal(address.user_id, null);
  assert.deepEqual(address.user, ganon);
  assert.deepEqual(address.attrs, {id: 1, user_id: null});
});

test('it can update its relationship to null via parent_id', function(assert) {
  address.user_id = null;

  assert.equal(address.user_id, null);
  assert.deepEqual(address.user, null);
  assert.deepEqual(address.attrs, {id: 1, user_id: null});
});

test('it can update its relationship to null via parent', function(assert) {
  address.user = null;

  assert.equal(address.user_id, null);
  assert.deepEqual(address.user, null);
  assert.deepEqual(address.attrs, {id: 1, user_id: null});
});
