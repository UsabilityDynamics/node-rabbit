/**
 * RabbitMQ Client Utility Methods
 *
 * @class Utility
 * @uses Abstract
 */
var Utility = require( 'abstract' ).utility;

/**
 * Extra Utility Methods
 *
 */
Object.defineProperties( module.exports = Utility, {
  debug: {
    /**
     * Debug Method
     *
     * Initialized method that uses the instance's "name" property, or constructor name, to identify
     * debug namespace. Caches instance in __debug.
     *
     * @returns {boolean|debug|string}
     */
    get: function get() {

      if( !this.name && !this.constructor.name ) {
        return console.error( new Error( 'Tried to initialize utility.debug() on an object without a name.' ) );
      }

      if( !Object.getOwnPropertyDescriptor( this, 'debug' ).configurable ) {
        return console.error( new Error( 'Treid to initialize debug but the property is not configurable.' ) );
      }

      Object.defineProperty( this, 'debug', {
        /**
         * Debug
         *
         * @returns {*}
         */
        value: function debug() {
          var debug = this.__debug = this.__debug || require( 'debug' )([ 'rabbit', 'client', this.name || this.constructor.name  ].join( ':' ))
          debug.apply( this, arguments );

          // @chainable
          return this;

        },
        writable: false,
        configurable: false,
        enumerable: true
      });

      return this.debug;


    },
    enumerable: true,
    configurable: true
  },
  subscribe: {
    /**
     * Subscribe to Pattern
     *
     * @param pattern
     * @param handler
     * @param options {Object}
     * @returns {*}
     */
    value: function subscribe( pattern, handler, options ) {
      this.debug( '%s.subscribe(%s)', this.name, pattern );

      if( !this.connection || !this.exchange ) {
        throw Error( 'Connectedion not ready.' );
      }

      var self = this;

      // Queue Defaults
      options = Utility.defaults( options || {}, {
        durable: true,
        exclusive: false
      });

      // Create a self-named queue
      this.connection.queue( this.name, options, function( queue ) {

        // find out what self.channel is

        // Bind Exchange with topic "pattern"
        queue.bind( self.exchange, pattern );

        // @debug
        console.log( "created queue", this.name, "bound to pattern", pattern );

        // Hadle messages.
        queue.subscribe( function have_message( message ) {

          // Print messages to stdout
          console.log( "have_message:", message );

          // Call Handler in request/response context
          handler.call({
            time: undefined,
            debug: function() {}
          }, {
            get: function() {},
            param: function() {}
          }, {
            send: function() {},
            set: function() {}
          });

        });

      });

      // @chainable
      return this;

    },
    enumerable: true,
    writable: true,
    configurable: true
  },
  unsubscribe: {
    value: function unsubscribe( consumer_tag ) {
      this.debug( '%s.unsubscribe(%s)', this.name, consumer_tag );

      if( !this.connection || !this.exchange ) {
        throw Error( 'Connectedion not ready.' );
      }

      // @chainable
      return this;

    },
    enumerable: true,
    writable: true,
    configurable: true
  },
  publish: {
    /**
     * Publish Message to Exchange
     *
     * @param pattern {String} AMQP
     * @param message
     * @returns {*}
     */
    value: function publish( pattern, message, options ) {

      this.debug( '%s.publish(%s,%s)', this.name, pattern, message );
      this.debug( '%s.publish(%s,%s)', this.name, pattern, message );

      if( !this.connection || !this.exchange ) {
        throw Error( 'Connectedion not ready.' );
      }

      options = Utility.defaults( options, {
        //appId: this.get( 'identity' ),
        type: this.type,
        //correlationId: correlation.id,
        messageId: Math.random().toString( 36 ).substring( 2 ),
        //replyTo: correlation.sid,
        // contentType: 'application/json',
        // deliveryMode: 2,
        headers: {
          // correlation_key: correlation.key,
          activity_type: this.type
        }
      });

      // is confirmation required?
      if( this.exchange.confirm ) {}

      this.exchange.publish( pattern, message, options ).once( 'ack', function() {
        console.log( 'PUBLISH:ACK' );

      });

      // @chainable
      return this;

    },
    enumerable: true,
    writable: true,
    configurable: true
  },
  trim: {
    value: function( string ) {

      if( Buffer === typeof string ) {
        string = string.toString();
      }

      return require( 'string' )( string ).trim();

    },
    configurable: false,
    enumerable: true,
    writable: true
  },
  error: {
    /**
     *
     * @param error
     * @returns {*}
     */
    value: function error( error ) {

      if( 'string' === typeof error ) {
        error = new Error( error );
      }

      // Debug error.
      if( this.debug ) {
        this.debug( error );
      }

      // Log error.
      console.log( "Rabbit Client Error: [%s][%s]", error.message, error.code );

      // Emit error.
      if( this.emit ) {
        this.emit( 'error', error );
      }

      // @chainable
      return this;

    },
    enumerable: false,
    writable: true
  },
  msgpack: {
    value: require( 'msgpack' ),
    enumerable: true,
    writable: true,
    configurable: true
  },
  async: {
    value: require( 'async' ),
    enumerable: true,
    writable: true,
    configurable: true
  },
  winston: {
    value: require( 'winston' ),
    enumerable: true,
    writable: true,
    configurable: true
  },
  amqp: {
    value: require( 'amqp' ),
    enumerable: true,
    writable: true,
    configurable: true
  },
  dirname: {
    value: require( 'path' ).dirname,
    enumerable: true,
    writable: true,
    configurable: true
  },
  spawn: {
    value: require( 'child_process' ).spawn,
    configurable: false,
    enumerable: true,
    writable: true
  },
  defaults: {
    value: require( 'lodash' ).defaults,
    configurable: false,
    enumerable: true,
    writable: true
  },
  omit: {
    value: require( 'lodash' ).omit,
    configurable: false,
    enumerable: true,
    writable: true
  },
  inherits: {
    value: require( 'util' ).inherits,
    configurable: false,
    enumerable: true,
    writable: true
  },
  settings: {
    value: require( 'object-settings' ).mixin,
    configurable: false,
    enumerable: true,
    writable: true
  },
  validate: {
    value: require( 'object-validation' ).validate,
    configurable: false,
    enumerable: true,
    writable: true
  },
  emitter: {
    value: require( 'object-emitter' ).mixin,
    configurable: false,
    enumerable: true,
    writable: true
  },
  url_parse: {
    value: require( 'url' ).parse,
    configurable: false,
    enumerable: true,
    writable: true
  },
  request: {
    value: require( 'request' ),
    configurable: false,
    enumerable: true,
    writable: true
  }
});