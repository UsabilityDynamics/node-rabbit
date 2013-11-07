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
function Job( data ) {
  console.log( 'asdf' );

  // Make sure context is correct otherwise we could screw up the global scope.
  if( !( this instanceof Job ) ) {
    return new Job( data );
  }

  // Set Job Properties
  Object.defineProperties( this, {
    id: {
      value: data.id,
      enumerable: true,
      configurable: true,
      writable: true
    },
    debug: {
      value: require( 'debug' )( [ 'rabbit', 'client', 'job', data.type ].join( ':' ) ),
      enumerable: true,
      configurable: true,
      writable: true
    },
    type: {
      value: data.type,
      enumerable: true,
      configurable: true,
      writable: true
    },
    format: {
      value: data.format || 'application/json',
      enumerable: true,
      configurable: true,
      writable: true
    },
    correlation_key: {
      value: data.correlation_key,
      enumerable: true,
      configurable: true,
      writable: true
    },
    client: {
      value: data.client,
      enumerable: true,
      configurable: true,
      writable: true
    },
    routing: {
      value: data.routing,
      enumerable: true,
      configurable: true,
      writable: true
    },
    message: {
      value: this.unpack( data.message ),
      enumerable: true,
      configurable: true,
      writable: true
    },
    meta: {
      value: data.meta,
      enumerable: false,
      configurable: true,
      writable: true
    },
    queue: {
      value: data.queue,
      enumerable: false,
      configurable: true,
      writable: true
    },
    exchange: {
      value: data.exchange,
      enumerable: false,
      configurable: true,
      writable: true
    },
    rabbit: {
      value: data.rabbit,
      enumerable: false,
      configurable: true,
      writable: true
    },
    headers: {
      value: data.headers,
      enumerable: false,
      configurable: true,
      writable: true
    }
  });

  // Mixin Settings and EventEmitter
  Job.utility.settings( this );
  Job.utility.emitter( this );

  // console.log( require( 'util' ).inspect( this, { showHidden: false, colors: true, depth: 2 } ) )

  // @chainable
  return this;

}

// Rabbit Job prototype properties.
Object.defineProperties( Job.prototype, {
  pack: {
    /**
     * Pack String
     *
     * @param string
     * @returns {*}
     */
    value: function pack( string ) {

      if( this.format === 'application/msgpack' ) {

        if( this.data instanceof Buffer ) {
          this.data = this.data.toString();
        }

        this.data = Job.utility.msgpack.pack( string || this.data );

      }

      return this.data;

    },
    enumerable: true,
    configurable: true,
    writable: true
  },
  unpack: {
    /**
     * Unpack Message
     *
     * @param string
     * @returns {*}
     */
    value: function unpack( message ) {

      if( this.format === 'application/msgpack' ) {

        if( message instanceof Buffer ) {
          message = message.toString();
        }

        message = Job.utility.msgpack.unpack( message );

      }

      return message;

    },
    enumerable: true,
    configurable: true,
    writable: true
  },
  progress: {
    /**
     * Update Progress.
     *
     * @method progress
     * @param string
     * @returns {*}
     */
    value: function progress( value, message ) {
      this.debug( 'Updating progress job type [%s]. Responding to CQ [%s].', this.routing, this.correlation_key );

      // Publish progress message to Session Queue.
      this.exchange.publish( this.correlation_key, {
        progress: value,
        message: message instanceof Error ? message.message : message
      }, {
        messageId: this.id,
        contentType: this.format,
        type: this.correlation_key,
        deliveryMode: 2,
        headers: {
          event: 'progress',
          is_error: error instanceof Error ? true : false,
          correlation_key: this.correlation_key,
          job_type: this.type
        }
      });

      // @chainable
      return this;

    },
    enumerable: true,
    configurable: true,
    writable: true
  },
  complete: {
    /**
     * Complete Job.
     *
     * @method complete
     * @param string
     * @returns {*}
     */
    value: function complete( error, response ) {
      this.debug( 'Completing job type [%s]. Responding to Session Queue [%s].', this.routing, this.correlation_key );

      if( 'object' !== typeof response ) {
        response = { message: response }
      }

      // Publish message to Session Queue
      this.exchange.publish( this.correlation_key, response, {
        messageId: this.id,
        contentType: this.format,
        type: this.correlation_key,
        deliveryMode: 2,
        headers: {
          event: 'complete',
          is_error: error instanceof Error ? true : false,
          correlation_key: this.correlation_key,
          job_type: this.type
        }
      });

      // @todo Should we force-closure Session Queue?

      // @chainable
      return this;

    },
    enumerable: true,
    configurable: true,
    writable: true
  }
});

// Rabit Job constructor properties.
Object.defineProperties( module.exports = Job, {
  Rabbit: {
    value: require( './rabbit-client' ),
    enumerable: false,
    configurable: true,
    writable: true
  },
  Correlation: {
    value: require( './correlation' ),
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
     * @returns {Job}
     */
    value: function create( data ) {
      return new Job( data );
    },
    enumerable: true,
    configurable: true,
    writable: true
  }
});