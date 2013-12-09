/**
 * Session Queues
 *
 * The prototype must be registered prior to being initalized.
 *
 * @param name {String} Unique identifier for Session, used to configure queue names, correlation keys, etc.
 * @returns {Session}
 * @constructor
 */
function Session( name ) {

  // Make sure context is correct otherwise we could screw up the global scope.
  if( !( this instanceof Session ) ) {
    return Session.create( name );
  }

  // No name.
  if( 'string' !== typeof name ) {
    return this.error( new Error( 'The Session name must be set.' ) );
  }

  // Lockin Session Instance Name
  Object.defineProperty( this, 'name', {
    value: name,
    enumerable: true,
    configurable: false,
    writable: false
  });

  this.debug( 'Initializing Session [%s] for [%s] exchange.', name, this.exchange.name );

  // @chainable
  return this;

}

// Session Instance Properties.
Object.defineProperties( Session.prototype, {
  name: {
    /**
     * Session Name
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
     * Session Group / Type
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
     * Session Connection
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
     * Session Exchange
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
  subscribe: {
    value: require( '' ).prototype.subscribe,
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

// Session Constructor Properties.
Object.defineProperties( module.exports = Session, {
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