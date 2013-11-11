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
  pack: {
    /**
     * Pack String
     *
     * @param string
     * @returns {*}
     */
    value: function pack( message ) {

      if( message instanceof Buffer ) {
        message = message.toString();
      }

      return module.exports.utility.msgpack.pack( message );

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

      if( string instanceof Buffer ) {
        string = string.toString();
      }

      return module.exports.utility.msgpack.unpack( message );

    },
    enumerable: true,
    configurable: true,
    writable: true
  },
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

          if( !this.__debug ) {
            Object.defineProperty( this, '__debug', {
              value: require( 'debug' )([ 'rabbit', 'client', this.type, this.name || this.constructor.name  ].join( ':' )),
              enumerable: false,
              configurable: true
            });
          }

          // Apply.
          this.__debug.apply( this, arguments );

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
  }
});