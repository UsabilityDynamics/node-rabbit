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
    return new Session( name );
  }

  // No name.
  if( 'string' !== typeof name ) {
    return this.error( new Error( 'The Session name must be set.' ) );
  }

  // Activie Already Exists.
  if( Session.pool[ name ] ) {
    return Session.pool[ name ].debug( 'Session instance [%s] restored.', name );
  }

  this.debug( 'Initializing Session [%s] for [%s] exchange.', name, this.exchange.name );

  // Lockin Session Instance Name
  Object.defineProperty( this, 'name', {
    value: name,
    enumerable: true,
    configurable: false,
    writable: false
  });

  // @chainable
  return Session.pool[ name ] = this;

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

  active: {
    /**
     * Session Prototype Status
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

// Session Constructor Properties.
Object.defineProperties( module.exports = Session, {
  create: {
    value: function create() {
      return new Session( arguments[0] );
    },
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
    /**
     * Initialize Prototype
     *
     * @param type {String}
     * @param settings
     * @returns {Function}
     */
    value: function declare( type, settings, handler ) {

      // If already declareed do nothing.
      if( Session.prototype.active ) {
        return Session;
      }

      if( !type ) {
        throw new Error( 'Can not declare Session without a valid type.' );
      }

      var _exchange_settings = {
        autoDelete: settings.autoDelete || false,
        arguments: {
          created: new Date().getTime()
        },
        confirm: settings.confirm,
        durable: settings.durable,
        noDeclare: false, // @important If true will not create new exchange on first connection.
        passive: settings.passive,
        type: 'topic'
      };

      /**
       * Update Prototype Properties.
       *
       */
      Object.defineProperties( Session.prototype, {
        type: {
          /**
           * Set Session Type - can not be changed
           *
           */
          value: type,
          enumerable: true,
          configurable: false,
          writable: false
        },
        active: {
          value: true,
          enumerable: true,
          configurable: false,
          writable: true
        },
        connection: {
          value: settings.connection,
          enumerable: false,
          configurable: false,
          writable: false
        },
        exchange: {
          value: settings.connection.exchange( type + '.topic', _exchange_settings, function have_exchange( exchange ) {

            if( 'function' === typeof handler ) {
              new handler( Session, exchange );
            }

          }),
          enumerable: false,
          configurable: true,
          writable: false
        }
      });

      // @chainable
      return Session;

    },
    enumerable: true,
    configurable: true,
    writable: true
  },
  exchange: {
    /**
     * Exchange Link
     *
     * @returns {boolean|debug|string}
     */
    get: function() {
      return Session.prototype.exchange ? true : false;
    },
    enumerable: true,
    configurable: true
  },
  pool: {
    /**
     * Instance Pool
     *
     */
    value: {},
    enumerable: false,
    configurable: true,
    writable: true
  }
});