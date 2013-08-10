/**
 * Correlation Response Stream
 *
 * -
 *
 * @constructor
 * @chainable
 * @author potanin
 * @date 8/10/13
 */
function Correlation() {
  Correlation.debug( 'Created new correlation.' );

  // Make sure context is correct otherwise we could screw up the global scope.
  if( !( this instanceof Correlation ) ) {
    return new Correlation();
  }

  Object.defineProperties( this, {
    id: {
      value: Math.random().toString( 36 ).substring( 2 ),
      enumerable: true,
      configurable: true,
      writable: false
    },
    key: {
      get: function() { return [ 'correlation', this.id ].join( '.' ) },
      enumerable: true,
      configurable: true
    }
  })

  // Mixin Settings and EventEmitter
  require( 'object-settings' ).mixin( this );
  require( 'object-emitter' ).mixin( this );

  // @chainable
  return this;

}

// Rabbit Correlation prototype properties.
Object.defineProperties( Correlation.prototype, {
  timeout: {
    /**
     * Correlation job timeout.
     *
     * @todo -
     * @returns {*}
     */
    value: function timeout() {

      // @chainable
      return this;

    },
    enumerable: true,
    configurable: true,
    writable: true
  }
})

// Rabit Correlation constructor properties.
Object.defineProperties( module.exports = Correlation, {
  create: {
    /**
     *
     * @param data
     * @returns {Correlation}
     */
    value: function create() {
      return new Correlation();
    },
    enumerable: true,
    configurable: true,
    writable: true
  },
  debug: {
    value: require( 'debug' )( 'rabbit:correlation' ),
    enumerable: false,
    writable: true,
    configurable: true
  }
});

