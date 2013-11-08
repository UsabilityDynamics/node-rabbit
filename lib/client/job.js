/**
 * Job Instance
 *
 * -
 *
 * @chainable
 *
 * @param data
 * @returns {*}
 * @constructor
 *
 * @author potanin@UD
 */
function Job( id ) {

  // Make sure context is correct otherwise we could screw up the global scope.
  if( !( this instanceof Job ) ) {
    return new Job( id );
  }

  // Mixin Settings and EventEmitter
  Job.utility.settings( this );

  // @chainable
  return this;

}

// Job Prototype Properties.
Object.defineProperties( Job.prototype, {
  name: {
    /**
     * Activity Name
     *
     * Prototype is considered unregistered until set.
     *
     */
    value: undefined,
    enumerable: true,
    configurable: true,
    writable: true
  },
  type: {
    /**
     * Activity Group / Type
     *
     * Prototype is considered unregistered until set.
     *
     */
    value: 'activity',
    enumerable: true,
    configurable: true,
    writable: true
  },

  active: {
    /**
     * Activity Prototype Status
     *
     * Prototype is considered unregistered until set.
     *
     */
    value: false,
    enumerable: true,
    configurable: true,
    writable: true
  },
  connection: {
    /**
     * Activity Connection
     *
     * Prototype is considered unregistered until set.
     *
     */
    value: undefined,
    enumerable: true,
    configurable: true,
    writable: true
  },
  exchange: {
    /**
     * Activity Exchange
     *
     * Prototype is considered unregistered until set.
     *
     */
    value: undefined,
    enumerable: true,
    configurable: true,
    writable: true
  },

  request: {
    value: require( './exchange' ).prototype.request,
    enumerable: true,
    configurable: true,
    writable: true
  },

  subscribe: {
    value: require( './exchange' ).prototype.subscribe,
    enumerable: true,
    configurable: true,
    writable: true
  },
  unsubscribe: {
    value: require( './exchange' ).prototype.unsubscribe,
    enumerable: true,
    configurable: true,
    writable: true
  },
  publish: {
    value: require( './exchange' ).prototype.publish,
    enumerable: true,
    configurable: true,
    writable: true
  },
  message: {
    value: require( './exchange' ).prototype.message,
    enumerable: true,
    configurable: true,
    writable: true
  },

  error: {
    value: require( '../utility' ).error,
    enumerable: true,
    configurable: true,
    writable: true
  },
  debug: {
    value: require( '../utility' ).debug,
    enumerable: true,
    configurable: true,
    writable: true
  },

  pack: {
    value: require( './exchange' ).prototype.pack,
    enumerable: true,
    configurable: true,
    writable: true
  },
  unpack: {
    value: require( './exchange' ).prototype.unpack,
    enumerable: true,
    configurable: true,
    writable: true
  },
  progress: {
    value: require( './exchange' ).prototype.progress,
    enumerable: true,
    configurable: true,
    writable: true
  },
  complete: {
    value: require( './exchange' ).prototype.complete,
    enumerable: true,
    configurable: true,
    writable: true
  }
});

// Job Constructor Properties.
Object.defineProperties( module.exports = Job, {
  create: {
    /**
     *
     * @param data
     * @returns {Job}
     */
    value: function create( id ) {
      return new Job( id );
    },
    enumerable: true,
    configurable: true,
    writable: true
  },
  utility: {
    value: require( '../utility' ),
    enumerable: false,
    writable: true,
    configurable: true
  }
});