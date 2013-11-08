/**
 *
 * @param handler
 * @constructor
 */
function Exchange( handler ) {

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

  active: {
    /**
     * Activity Prototype Status
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

        this.data = Exchange.utility.msgpack.pack( string || this.data );

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

        message = Exchange.utility.msgpack.unpack( message );

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

      // Publish progress message to Exchange Queue.
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
     * Complete Exchange.
     *
     * @method complete
     * @param string
     * @returns {*}
     */
    value: function complete( error, response ) {
      this.debug( 'Completing job type [%s]. Responding to Exchange Queue [%s].', this.routing, this.correlation_key );

      if( 'object' !== typeof response ) {
        response = { message: response }
      }

      // Publish message to Exchange Queue
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

      // @todo Should we force-closure Exchange Queue?

      // @chainable
      return this;

    },
    enumerable: true,
    configurable: true,
    writable: true
  },

  message: {
    value: function message() {

      Object.defineProperties( this, {
        id: {
          value: id,
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

    },
    enumerable: true,
    configurable: true,
    writable: true
  },
  request: {
    /**
     *
     * @param activity_type {String}
     * @param message
     * @param headers
     * @param info
     * @param queue
     */
    value: function request( activity_type, message, headers, info, queue ) {
      this.debug( 'Handling incoming work request for job [%s] in [%s] exchange.', activity_type, this.get( 'exchange.name' ) );

      // Create Exchange instance from incoming message.
      var job = Exchange.create({
        id: info.messageId,
        exchange: this.get( 'exchange' ),
        type: info.type,
        client: info.replyTo,
        message: message,
        format: info.contentType,
        routing: info.routingKey,
        correlation_key: headers.correlation_key,
        meta: {
          exchange: info.exchange,
          appId: info.appId,
          correlation: info.correlationId,
          mode: info.deliveryMode,
          consumer: info.consumerTag,
          redelivered: info.redelivered
        },
        queue: queue,
        headers: headers
      });

      // Call the Exchange Worker callback.
      try {

        this.__activities[ job.type ].call( job, job.message, function complete_wrapper( error, response ) {
          return job.complete( error, response );
        });

      } catch( error ) { return this.error( error ); }

      // @chainable
      return this;

    },
    enumerable: true,
    configurable: true,
    writable: true
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
      this.debug( '%s.subscribe(%s)', this.constructor.name, pattern );

      if( !this.connection || !this.exchange ) {
        throw Error( 'Connectedion not ready.' );
      }

      var self = this;

      // Queue Defaults
      options = Exchange.utility.defaults( options || {}, {
        durable: true,
        exclusive: false
      });

      // Create a self-named queue
      this.connection.queue( [ this.type, this.name ].join( '.' ), options, function( queue ) {

        // Bind Exchange with topic "pattern"
        queue.bind( self.exchange, pattern, function() {
          self.debug( "Created queue [%s] and bound to pattern [%s].", queue.name, pattern );
        });

        // Hadle messages.
        queue.subscribe( function have_message( data, headers, info, message ) {
          self.debug( "Have message on [%s][%s]  [%s].", info.exchange, info.queue, data );

          if( 'function' !== typeof handler ) {
            return message.reject();
          }

          // Acknowledge receipt
          message.acknowledge();

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

      options = Exchange.utility.defaults( options, {
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
  }

});

// Exchange Constructor Properties.
Object.defineProperties( module.exports = Exchange, {
  Rabbit: {
    value: require( '../rabbit-client' ),
    enumerable: false,
    configurable: true,
    writable: true
  },
  create: {
    value: function create() {
      return new Exchange( arguments[0] );
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

      // If already registered do nothing.
      if( this.prototype.active ) {
        return this;
      }

      if( !type ) {
        throw new Error( 'Can not declare Exchange without a valid type.' );
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
      Object.defineProperties( this.prototype, {
        type: {
          /**
           * Set Exchange Type - can not be changed
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
              new handler( Exchange, exchange );
            }

          }),
          enumerable: false,
          configurable: true,
          writable: false
        }
      });

      // @chainable
      return this;

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
      return Exchange.prototype.exchange ? true : false;
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