import { singularize } from 'ember-cli-mirage/utils/inflector';
import Association from './association';

export default Association.extend({

  defineRelationship: function(model, key, schema) {
    var _this = this;

    Object.defineProperty(model, key, {
      get: function () {
        var relatedType = _this.type ? _this.type : singularize(key);
        var foreignKey = model.type + '_id';
        var query = {};
        query[foreignKey] = model.id;

        return schema[relatedType].where(query);
      }
      // set: function (val) { _this.attrs[attr] = val; return _this; },
    });
  }

});

