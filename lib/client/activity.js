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
    return new Activity( name );
  }

  // No name.
  if( 'string' !== typeof name ) {
    return this.error( new Error( 'The Activity name must be set.' ) );
  }

  // Activie Already Exists.
  if( Activity.pool[ name ] ) {
    // @chainable
    return Activity.pool[ name ].debug( 'Activity instance [%s] restored.', name );
  }

  this.debug( 'Initializing Activity [%s] for [%s] exchange.', name, this.exchange.name );

  // Lockin Activity Instance Name
  Object.defineProperty( this, 'name', {
    value: name,
    enumerable: true,
    configurable: false,
    writable: false
  });

  // @chainable
  return Activity.pool[ name ] = this;

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

  active: {
    /**
     * Activity Prototype Status
     *
     * Prototype is considered undeclareed until set.
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

// Activity Constructor Properties.
Object.defineProperties( module.exports = Activity, {
  create: {
    value: function create() {
      return new Activity( arguments[0] );
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
      if( Activity.prototype.active ) {
        return Activity;
      }

      if( !type ) {
        throw new Error( 'Can not declare Activity without a valid type.' );
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
      Object.defineProperties( Activity.prototype, {
        type: {
          /**
           * Set Activity Type - can not be changed
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
              new handler( Activity, exchange );
            }

          }),
          enumerable: false,
          configurable: true,
          writable: false
        }
      });

      // @chainable
      return Activity;

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
      return Activity.prototype.exchange ? true : false;
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