import { singularize, capitalize } from 'ember-cli-mirage/utils/inflector';
import Association from './association';

/*
say an address belongs to user

current problem:
  how to setup user_id
  how to setup user

how to get user, user_id in the following situations?
  address.new({user_id: 1})
    user_id is 1
    user is schema.user.find(1)

  address.new({user_id: null})
    user_id is null
    user is null

  address.new({}) // no user_id
    user_id is null
    user is null

  address.user_id =

after_instantiation:
  address
  user is new
  address has a saved user
  address has a new user
  address has no user
*/

export default Association.extend({

  defineRelationship: function(model, key, schema) {
    var _this = this;
    var foreignKey = key + '_id';

    // this._ensureForeignKeyIsDefined(model, foreignKey);

    // Define the foreign key getter/setter
    // Object.defineProperty(model, foreignKey, {
    //   get: function() {
    //     return this.attrs[attr];
    //   },
    //   set: function(val) {
    //     this.attrs[attr] = val; return this;
    //   }
    // });

    // Define the relationship getter/setter
    Object.defineProperty(model, key, {
      get: function() {
        if (this._tempParent) {
          return this._tempParent;
        }

        var relatedType = _this.type ? _this.type : singularize(key);
        return schema[relatedType].find(model[foreignKey]);
      },
      set: function(newModel) {
        if (newModel.isNew()) {
          this._tempParent = newModel;
        } else {
          this._tempParent = null;
          model[foreignKey] = newModel.id;
        }
      }
    });

    model['create' + capitalize(key)] = function(attrs) {
      var newModel = schema[key].create(attrs);
      model.update(foreignKey, newModel.id);

      return newModel;
    };

    // Not implemented yet
    // model['new' + capitalize(key)] = function(attrs) {
    //   var newModel = schema[key].new(attrs);
    //   model[foreignKey] = newModel.getUuid();

    //   return newModel;
    // };
  },

  _ensureForeignKeyIsDefined: function(model, foreignKey) {
    model.defineAttribute(foreignKey);
  }

});
