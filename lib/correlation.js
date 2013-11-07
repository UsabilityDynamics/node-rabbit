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
function Correlation( data ) {

  // Make sure context is correct otherwise we could screw up the global scope.
  if( !( this instanceof Correlation ) ) {
    return new Correlation( data );
  }

  Object.defineProperties( this, {
    id: {
      value: Math.random().toString( 36 ).substring( 2 ),
      enumerable: true,
      configurable: true,
      writable: false
    },
    job_key: {
      value: data.job_key,
      writable: true,
      enumerable: true,
      configurable: true
    },
    job_type: {
      value: data.job_type,
      enumerable: true,
      writable: false,
      configurable: true
    },
    key: {
      get: function() { return [ 'correlation', this.id ].join( '.' ) },
      enumerable: true,
      configurable: true
    },
    sid: {
      value: data.sid,
      enumerable: true,
      writable: true,
      configurable: true
    },
    mid: {
      value: data.mid,
      enumerable: true,
      writable: true,
      configurable: true
    },
    format: {
      value: data.format,
      enumerable: true,
      writable: true,
      configurable: true
    },
    debug: {
      value: require( 'debug' )( [ 'rabbit', 'client', 'correlation', data.job_type ].join( ':' ) ),
      enumerable: true,
      configurable: true,
      writable: true
    }
  })

  // Mixin Settings and EventEmitter
  Correlation.utility.settings( this );
  Correlation.utility.emitter( this );

  this.debug( 'Created new correlation [%s].', this.id );

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
});

// Rabit Correlation constructor properties.
Object.defineProperties( module.exports = Correlation, {
  Rabbit: {
    value: require( './rabbit-client' ),
    enumerable: false,
    configurable: true,
    writable: true
  },
  Job: {
    value: require( './job' ),
    enumerable: false,
    configurable: true,
    writable: true
  },
  utility: {
    value: require( './utility' ),
    enumerable: false,
    writable: true,
    configurable: true
  },
  create: {
    /**
     *
     * @param data
     * @returns {Correlation}
     */
    value: function create( data ) {
      return new Correlation( data );
    },
    enumerable: true,
    configurable: true,
    writable: true
  }
});

