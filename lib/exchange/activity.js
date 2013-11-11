/**
 * Create Activity
 *
 * The prototype must be declareed prior to being initalized.
 *
 * @param name {String} Unique identifier for Activity, used to configure queue names, correlation keys, etc.
 * @returns {Activity}
 * @constructor
 */
function Activity( name ) {

  // Make sure context is correct otherwise we could screw up the global scope.
  if( !( this instanceof Activity ) ) {
    return Activity.create( name );
  }

  // No name.
  if( 'string' !== typeof name ) {
    return this.error( new Error( 'The Activity name must be set.' ) );
  }

  // Lockin Activity Instance Name
  Object.defineProperty( this, 'name', {
    value: name,
    enumerable: true,
    configurable: false,
    writable: false
  });

  this.debug( 'Initializing Activity [%s] for [%s] exchange.', name, this.exchange.name );

  // @chainable
  return this;

}

// Activity Instance Properties.
Object.defineProperties( Activity.prototype, {
  name: {
    /**
     * Activity Name
     *
     * Prototype is considered undeclareed until set.
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
     * Prototype is considered undeclareed until set.
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
     * Prototype is considered undeclareed until set.
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
     * Prototype is considered undeclareed until set.
     *
     */
    value: undefined,
    enumerable: true,
    configurable: true,
    writable: true
  },
  create_context: {
    value: require( '../exchange' ).prototype.create_context,
    enumerable: true,
    configurable: true,
    writable: true
  },
  subscribe: {
    value: require( '../exchange' ).prototype.subscribe,
    enumerable: true,
    configurable: true,
    writable: true
  },
  request: {
    value: require( '../exchange' ).prototype.request,
    enumerable: true,
    configurable: true,
    writable: true
  },
  response: {
    value: require( '../exchange' ).prototype.response,
    enumerable: true,
    configurable: true,
    writable: true
  },
  unsubscribe: {
    value: require( '../exchange' ).prototype.unsubscribe,
    enumerable: true,
    configurable: true,
    writable: true
  },
  publish: {
    value: require( '../exchange' ).prototype.publish,
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

// Activity Constructor Properties.
Object.defineProperties( module.exports = Activity, {
  create: {
    value: require( '../exchange' ).create.bind( Activity ),
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
    value: require( '../exchange' ).declare,
    enumerable: true,
    configurable: true,
    writable: true
  }
});