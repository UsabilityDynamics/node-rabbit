/**
 *
 * @param handler
 * @constructor
 */
function Exchange( name ) {

  if( !this.connection ) {
    console.log( 'Exchange can not be properly instantiated until the connection is set.' );
  }

  // Lockin Activity Instance Name
  Object.defineProperty( this, 'name', {
    value: name,
    enumerable: true,
    configurable: false,
    writable: false
  });

  // @chainable
  return this;

}

// Exchange Instance Properties.
Object.defineProperties( Exchange.prototype, {
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
    value: undefined,
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
  request: {
    /**
     * Exchange Request Object
     *
     */
    value: {
      auth: function auth() {},
      param: function param() {},
      kill: function kill() {

        this.queue.destroy({
          ifUnused: false,
          ifEmpty: false
        });

      },
      on: function on() {}
    },
    configurable: true,
    enumerable: true,
    writable: true
  },
  response: {
    /**
     * Exchange Response Object
     *
     */
    value: {
      /**
       * Update Progress.
       *
       * @method progress
       * @param string
       * @returns {*}
       */
      progress: function progress( value, message ) {
        this.debug( 'Updating progress job type [%s]. Responding to CQ [%s].', this.routing, this.correlation_key );

        // Publish progress message to module.exports Queue.
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
      /**
       * Complete Exchange.
       *
       * @method complete
       * @param string
       * @returns {*}
       */
      complete: function complete( error, response ) {
        this.debug( 'Completing job type [%s]. Responding to Exchange Queue [%s].', this.routing, this.correlation_key );

        if( 'object' !== typeof response ) {
          response = { message: response }
        }

        require( './job' ).create( this.get( 'headers.correlation-id' ) ).publish(
          this.get( 'headers.correlation-id' ),
          response, {
            type: this.get( 'headers.correlation-id' ),
            deliveryMode: 2,
            headers: {
              event: 'complete',
              is_error: error instanceof Error ? true : false,
              correlation_key: this.get( 'headers.correlation-id' ),
              job_type: this.type
            }
        });

        // @chainable
        return this;

      },
      send: function send( message ) {
        console.log( 'Completing job type [%s]. Responding to Exchange Queue [%s].', this.get( 'headers.type' ), this.get( 'headers.correlation-id' ) );

        if( !this.get( 'headers.correlation-id' ) ) {
          console.log( 'Can not respond - no correlation ID.' );
          return;
        }

        require( './job' ).create( this.get( 'headers.correlation-id' ) ).publish( this.get( 'headers.correlation-id' ), message );

        // @chainable
        return this;

      },
      header: function header() {},
      emit: function emit() {},
      error: function error() {}
    },
    configurable: true,
    enumerable: true,
    writable: true
  },
  create_context: {
    /**
     * Prepare Handler Context to work with incoming message.
     *
     * @param {Object}    message
     * @param {Object}    message.body
     * @param {String}    message.type Job Type
     * @param {Object}    message.headers
     * @param {String}    message.headers.message-id
     * @param {Buffer}    message.headers.delivery-tag
     * @param {String}    message.headers.consumer-tag
     * @param {String}    message.headers.routing-key
     * @param {String}    message.headers.content-type
     * @param {String}    message.headers.delivery-mode
     * @param {String}    message.headers.priority
     * @param {String}    message.headers.correlation-id
     * @param {String}    message.headers.content-encoding
     * @param {Boolean}   message.headers.redelivered
     * @param {String}    message.headers.timestamp
     * @param {String}    message.headers.user-id
     * @param {String}    message.headers.app-id
     * @param {String}    message.headers.cluster-id
     * @param {String}    message.headers.reply-to
     * @param {String}    message.headers.queue
     * @param {String}    message.headers.exchange
     * @param {Function}  message.acknowledge
     * @param {Function}  message.reject
     * @param {Function}  message.shift
     * @param {Object}    message.queue Queue object
     * @param {Object}    message.exchange Exchange object.
     * @param {Function}  handler Callback method provided by subscription method.
     *
     * @returns {*}
     */
    value: function create_context( message,  handler ) {
      this.debug( 'Handling incoming work request for job [%s] in [%s] exchange.', message.type, this.exchange.name );

      // module.exports.utility.emitter( handler.prototype );

      // Create Exchange instance from incoming message.
      handler.prototype.type      = message.type;
      handler.prototype.debug     = console.log;
      handler.prototype.queue     = message.queue;
      handler.prototype.request   = this.request;
      handler.prototype.response  = this.response;

      module.exports.utility.settings( handler.prototype.response );
      module.exports.utility.settings( handler.prototype.request );

      // Set Request Settings.
      handler.prototype.request.set( 'headers', message.headers );
      handler.prototype.request.set( 'body', message.body );

      // Set Response Settings.
      handler.prototype.response.set( 'headers', message.headers );
      handler.prototype.response.set( 'body', {} );

      // Invoke handler
      return new handler( handler.prototype.request, handler.prototype.response );

    },
    enumerable: true,
    configurable: true,
    writable: true
  },
  subscribe: {
    /**
     * Subscribe to Pattern
     *
     * @param pattern {String} Defaults to this.name.
     * @param handler {Function} Callback method, if not set will still bind.
     * @param options {Object}
     * @returns {*}
     */
    value: function subscribe( pattern, handler ) {

      if( !this.connection || !this.exchange ) {
        throw Error( 'Connectedion not ready.' );
      }

      var self        = this;
      var _queue      = [ this.type, this.name ].join( '.' );
      var _pattern    = pattern || this.name;

      // Queue Defaults
      var _options = module.exports.utility.defaults( 'object' === typeof ( arguments[2] || arguments[1] ) ? arguments[1] || arguments[2] : {}, {
        "autoDelete": true,
        "closeChannelOnUnsubscribe": true,
        "durable": true,
        "exclusive": false,
        "noDeclare": false,
        "passive": false
      });

      this.debug( 'Binding [%s:%s] queue to [%s] pattern.', this.type, this.name, _pattern );

      // Create a self-named queue
      this.connection.queue( _queue, _options, function( queue ) {

        // Bind Exchange with topic "pattern"
        queue.bind( self.exchange, _pattern, function bound() {
          self.debug( "Created queue [%s] and bound to pattern [%s].", _queue, _pattern );
        });

        if( !handler ) {
          return;
        }

        // Hadle messages.
        queue.subscribe( function( body, headers, info, message ) {

          if( info.correlationId ) {
            require( './job' ).create( info.correlationId ).subscribe();
          }

          if( message.contentType === 'application/msgpack' ) {
            body = module.exports.utility.unpack( body )
          }

            // Setup Headers
          module.exports.utility.extend( headers, {
            "type": info.type,
            "message-id": info.messageId,
            "delivery-tag": info.deliveryTag,
            "routing-key": info.routingKey,
            "consumer-tag": info.consumerTag,
            "content-type": message.contentType,
            "redelivered": info.redelivered,
            "delivery-mode": info.deliveryMode,
            "priority": info.priority,
            "correlation-id": info.correlationId,
            "content-encoding": info.contentEncoding,
            "timestamp": info.timestamp,
            "user-id": info.userId,
            "app-id": info.appId,
            "cluster-id": info.clusterId,
            "reply-to": info.replyTo,
            "exchange": info.exchange,
            "queue": info.queue
          });

            // Execute Message Context
          self.create_context({
            "type": info.type,
            "body": body,
            "headers": headers,
            "acknowledge": message.acknowledge,
            "reject": message.reject,
            "shift": message.shift,
            "queue": message.queue
          }, handler );

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
    /**
     *
     * @param consumer_tag
     * @returns {*}
     */
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
     * @param {String} pattern  AMQP
     * @param {Object} message
     * @param {Object} options.type
     * @param {Object} options.correlationId - Can not be blank if used.
     * @param {Object} options.replyTo - Can not be blank if used.
     * @returns {*}
     */
    value: function publish( routingKey ) {
      this.debug( '%s.publish( %s, %s )', this.constructor.name, routingKey );

      if( !this.connection || !this.exchange ) {
        throw Error( 'Connection not ready.' );
      }

      var self    = this;
      var message = arguments[1] || {};
      var options = arguments[2] || {};

      module.exports.utility.defaults( options, {
        type: this.type,
        messageId: Math.random().toString( 36 ).substring( 2 ),
        contentType: 'application/json',
        deliveryMode: 2,
        headers: {
          confirm: this.exchange.confirm ? true : false,
          correlation: null,
          name: this.name,
          type: this.type
        }
      });

      if( options.correlationId ) {
        self.debug( '%s.publish( %s, %s ) - Job has a correlation id: [%s].', self.constructor.name, routingKey, options.correlationId  );
      }

      try {

        this.exchange.publish( routingKey, message, options ).once( 'ack', function() {
          self.debug( '%s.publish( %s, %s ) - Acknowledged.', self.constructor.name, routingKey );
        });

      } catch( error ) { console.error( 'Publishing Error:' + error.message ); }

      // @chainable
      return this;

    },
    enumerable: true,
    writable: true,
    configurable: true
  }
});

// Exchange Constructor Properties.
Object.defineProperties( module.exports = Exchange, {
  create: {
    /**
     *
     * @returns {}
     */
    value: function create() {

      if( !arguments[0] ) {
        throw new Error( 'Unable to identify constructor.' );
      }

      if( !this.prototype.pool ) {
        throw new Error( 'Can not create Activity Instance Queue, the Activity Exchange has not been declared.' );
      }

      if( this.prototype.pool[ arguments[0] ]) {
        return this.prototype.pool[ arguments[0] ];
      }

      return this.prototype.pool[ arguments[0] ] = new this( arguments[0] ).subscribe();

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
     * @param {Object} settings
     * @param {String} settings.name Name of Exchange, will be set to object type later.
     * @param {String} settings.type Type of Exchange, such as "fanout" or "topic".
     * @param {String} settings.version
     * @param {Number} settings.expires Expiration timeout for queues.
     *
     * @returns {Function}
     */
    value: function declare( settings ) {

      // If already registered do nothing.
      if( this.prototype.pool ) {
        return this;
      }

      if( !settings.name ) {
        throw new Error( 'Can not declare Exchange without a valid name.' );
      }

      if( !settings.connection ) {
        throw new Error( 'Connection does not seem to be ready.' );
      }

      if( !settings.connection.exchange ) {
        throw new Error( 'Connection does not have the exchange method.' );
      }

      // Mixing external prototypes.
      this.utility.settings( this.prototype );
      this.utility.emitter( this.prototype );

      this.utility.defaults( settings, {
        name: 'exchange',
        type: 'topic',
        expires: undefined,
        autoDelete: true,
        passive: false,
        durable: true,
        confirm: true,
        noDeclare: false
      });

      // Store Exchange settings.
      this.prototype.set( 'settings', settings );

      /**
       * Update Prototype Properties.
       *
       */
      Object.defineProperties( this.prototype, {
        pool: {
          /**
           * Instance Pool
           *
           */
          value: {},
          enumerable: false,
          configurable: true,
          writable: true
        },
        type: {
          /**
           * Set Exchange Type - can not be changed
           *
           */
          value: this.prototype.get( 'settings.name' ),
          enumerable: true,
          configurable: false,
          writable: false
        },
        version: {
          /**
           * Set Exchange Type - can not be changed
           *
           */
          value: settings.version,
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
        }
      });

      Object.defineProperty( this.prototype, 'exchange', {
        value: settings.connection.exchange( this.prototype[ 'exchange-name' ] = [ 'rc', this.prototype.get( 'settings.name' ), 'topic' ].join( '.' ), {
          arguments: {
            type: this.prototype.get( 'settings.name' ),
            version: this.version || '0.0.0',
            created: new Date().getTime()
          },
          autoDelete: settings.autoDelete,
          confirm: settings.confirm,
          durable: settings.durable,
          noDeclare: settings.noDeclare,
          passive: settings.passive,
          type: this.prototype.get( 'settings.type' )
        }),
        enumerable: false,
        configurable: true,
        writable: false
      });

      this.prototype.exchange.on( 'open', function open() {
        // Exchange available.
      });

      // @chainable
      return this;

    },
    enumerable: true,
    configurable: true,
    writable: true
  }
});