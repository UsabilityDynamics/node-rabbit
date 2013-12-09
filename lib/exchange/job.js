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
function Job( name ) {

  // Make sure context is correct otherwise we could screw up the global scope.
  if( !( this instanceof Job ) ) {
    return Job.create( name );
  }

  // Lockin Activity Instance Name
  Object.defineProperty( this, 'name', {
    value: name,
    enumerable: true,
    configurable: false,
    writable: false
  });

  this.debug( 'Initializing Job [%s] for [%s] exchange.', name, this.exchange.name );

  // @chainable
  return this.pool[ name ] = this;

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
  create_context: {
    value: require( '' ).prototype.create_context,
    enumerable: true,
    configurable: true,
    writable: true
  },
  request: {
    value: require( '' ).prototype.request,
    enumerable: true,
    configurable: true,
    writable: true
  },
  response: {
    value: require( '' ).prototype.response,
    enumerable: true,
    configurable: true,
    writable: true
  },
  subscribe: {
    value: require( '' ).prototype.subscribe,
    enumerable: true,
    configurable: true,
    writable: true
  },
  unsubscribe: {
    value: require( '' ).prototype.unsubscribe,
    enumerable: true,
    configurable: true,
    writable: true
  },
  publish: {
    value: require( '' ).prototype.publish,
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
  }
});

// Job Constructor Properties.
Object.defineProperties( module.exports = Job, {
  create: {
    value: require( '' ).create,
    enumerable: true,
    configurable: true,
    writable: true
  },
  utility: {
    value: require( '../utility' ),
    enumerable: false,
    writable: false
  },
  declare: {
    value: require( '' ).declare,
    enumerable: true,
    configurable: true,
    writable: true
  }
});