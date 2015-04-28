import Factory from './factory';
import Response from './response';
import Sequence from './attributes/sequence';
import Lazy from './attributes/lazy';

export default {
  Factory: Factory,
  Response: Response,
  sequence: function(def) {
    return new Sequence(def);
  },
  lazy: function(def) {
    return new Lazy(def);
  }
};
