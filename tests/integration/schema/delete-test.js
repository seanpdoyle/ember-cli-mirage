import Schema from 'ember-cli-mirage/orm/schema';
import Model from 'ember-cli-mirage/orm/model';
import Db from 'ember-cli-mirage/orm/db';
import Collection from 'ember-cli-mirage/orm/collection';
import {module, test} from 'qunit';

var db, collection;
module('mirage:integration:schema:delete#collection', {
  beforeEach: function() {
    db = new Db();
    db.createCollection('users');
    var schema = new Schema(db);

    var User = Model.extend();
    schema.register('user', User);

    collection = new Collection([
      schema.user.create({name: 'Link', location: 'Hyrule', evil: false}),
      schema.user.create({name: 'Zelda', location: 'Hyrule', evil: false}),
    ]);
  }
});

test('it can destroy its models', function(assert) {
  assert.deepEqual(db.users.all(), [
    {id: 1, name: 'Link', location: 'Hyrule', evil: false},
    {id: 2, name: 'Zelda', location: 'Hyrule', evil: false},
  ]);

  collection.destroy();

  assert.deepEqual(db.users.all(), []);
});


var db, schema, User, Address;
module('mirage:integration:schema:delete#model', {
  beforeEach: function() {
    db = new Db();
    db.createCollection('users');
    db.users.insert([
      {id: 1, name: 'Link', evil: false}
    ]);
    schema = new Schema(db);

    User = Model.extend();

    schema.register('user', User);
  }
});

test('it can remove the record from the db', function(assert) {
  var link = schema.user.find(1);

  assert.deepEqual(link.attrs, {id: 1, name: 'Link', evil: false});

  link.destroy();

  assert.deepEqual(db.users.find(1), null);
  assert.deepEqual(db.users.all(), []);
});
