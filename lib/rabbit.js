/**
 * Rabbit
 *
 * The Rabbit works, or else the Rabbit gets fucked; proper fucked, that is
 *
 * ## Events
 * - connection: General connection event - could be an error or a success.
 * - connection.success: Successful connection event.
 * - connection.error: Connection failure.
 *
 * @param settings {Object} Configuration.
 * @param settings.exchange {String} Unique name for the work exchange, defaults to "node-rabbit".
 * @param settings.api {String} URL to RabbitMQ management API, if available.
 *
 * @param cb {Function} Callback function, optional. May also bind listener to "connection", "connection.success" or "connection.error" events.
 * @returns {Rabbit} Newly created Rabbit instance.
 * @async
 * @chainable
 * @constructor
 */
function Rabbit( settings, cb ) {
  Rabbit.debug( 'Creating new connection.' );

  // Make sure context is correct otherwise we could screw up the global scope.
  if( !( this instanceof Rabbit ) ) {
    return new Rabbit( settings, cb );
  }

  var Instance = this;

  // Mixin Settings and EventEmitter
  require( 'object-settings' ).mixin( Instance );
  require( 'object-emitter' ).mixin( Instance );

  // Configure instance.
  Instance.set({
    settings: Rabbit.extend( {}, Rabbit.defaults, settings ),
    options: {
      job_subscription: {
        prefetchCount: 10,
        ack: true
      },
      correlation_subscription: {
        prefetchCount: 10,
        ack: true
      },
    },
    environment: 'production',
    exchange: {},
    identity: String( process.pid )
  });

  // Connect to AMQP.
  this.connection = Rabbit.amqp.createConnection({
    host: Instance.get( 'settings.host' ),
    port: Instance.get( 'settings.port' ),
    login: Instance.get( 'settings.login' ),
    password: Instance.get( 'settings.password' ),
    vhost: Instance.get( 'settings.vhost' )
  }, {
    defaultExchangeName: Instance.get( 'settings.defaultExchange', '' ),
    reconnect: Instance.get( 'settings.reconnect', true ),
  });

  // Bind callback to ready event, if provided.
  if( 'function' === typeof cb ) {
    this.on( 'ready', cb );
  }

  // RabbitMQ connection failed.
  this.connection.on( 'error', function rabbit_error( error ) {
    Instance.emit( 'connection', new Error( error.message ), Instance );
    Instance.emit( 'connection.error', new Error( error.message ), Instance );
  });

  // RabbitMQ connection established.
  this.connection.on( 'ready', function rabbit_ready( connection ) {

    // Exchange Options.
    var _options = {
      type: 'direct',
      passive: false,
      durable: true,
      autoDelete: true,
      arguments: {
        created: new Date().getTime()
      }
    }

    // Create/Update Exchange.
    this.exchange( Instance.get( 'settings.exchange' ), _options, function have_exchange() {

      // Set Exchange Variables.
      Instance.set( 'exchange', this );

      // Emit connection success.
      Instance.emit( 'connection', null, Instance );
      Instance.emit( 'connection.success', Instance );

    });

  });

  // Return context.
  return this;

}

// Rabbit prototype properties.
Object.defineProperties( Rabbit.prototype, {
  configure: {
    /**
     * Configure Client
     *
     * Method executed when connection is ready.
     * Usage and semantics emulating Express.
     *
     * @param env
     * @param fn
     * @returns {*}
     */
    value: function configure( env, fn ) {
      var Instance  = this;
      var envs      = 'all';
      var args      = [].slice.call(arguments);

      fn = args.pop();

      if( args.length ) {
        envs = args;
      }

      if( 'all' == envs || ~envs.indexOf( this.get( 'environment' ) ) ) {
        Instance.on( 'connection.success', fn.bind( this, this ) );
      }

      return this;

    },
    enumerable: true,
    writable: true,
    configurable: true
  },
  registerJob: {
    /**
     * Define a job.
     *
     * @param name {String} Name of job type.
     * @param fn {Function} Function to process job.
     */
    value: function registerJob( type, fn ) {

      var Instance = this;

      if( 'function' !== typeof fn ) {
        Rabbit.debug( new Error( 'The second argument of registerJob() must be a function.' ) );
        return this;
      }

      // Job Queue Options.
      var _options = {
        durable: true,
        autoDelete: false,
        passive: false,
        arguments: {
          routing_key: [ 'job', type ].join( '.' ),
          type: type
        }
      };

      // Use the default 'amqueue.topic' exchange
      this.connection.queue( _options.arguments.routing_key, _options, function have_queue( queue ) {
        Rabbit.debug( 'Monitoring [%s/%s].', Instance.get( 'exchange.name' ), _options.arguments.routing_key );

        // Bind to exchange with routing of "job"
        queue.bind( Instance.get( 'exchange.name' ), _options.arguments.routing_key );

        // Receive messages
        queue.subscribe( Instance.get( 'options.job_subscription' ), function have_message( message, headers, info ) {

          // Acknowledge Receipt.
          if( Instance.get( 'options.job_subscription' ).ack ) {
            queue.shift();
          }

          // Create Job Instance.
          var job = Rabbit.Job.create({
            id: info.messageId,
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
              redelivered: info.redelivered,
            },
            queue: queue,
            headers: headers,
            exchange: Instance.get( 'exchange' ),
            rabbit: Instance
          })

          // Call the Job Worker callback.
          fn.call( job, job.message, function complete_wrapper( error, response ) {
            job.complete( error, response )
          });

        });

      });

    },
    enumerable: true,
    writable: true,
    configurable: true
  },
  runJob: {
    /**
     * Run a job.
     *
     * @method runJob
     * @chainable
     * @param job_type {String} Name of job type.
     * @param message {Object} Job data.
     * @param response {Function} Callback method.
     */
    value: function runJob( job_type, message, response ) {

      if( 'function' !== typeof response ) {
        return new Error( 'Response must be a method' );
      }

      var Instance            = this;

      var correlation         = Rabbit.Correlation.create({
        sid: Math.random().toString( 36 ).substring( 2 ),
        mid: Math.random().toString( 36 ).substring( 2 ),
        format: 'application/json',
        job_key: [ 'job', job_type ].join( '.' ),
        job_type: job_type
      });

      this.get( 'exchange' ).publish( correlation.job_key, message, {
        correlationId : correlation.id,
        type: correlation.job_key,
        messageId: correlation.mid,
        replyTo: correlation.sid,
        contentType: correlation.format,
        deliveryMode: 2,
        appId: this.get( 'identity' ),
        headers: {
          correlation_key: correlation.key,
          job_type: job_type
        }
      });

      // Create exclusive (Correlation) queue options.
      var _options = {
        durable: true,
        exclusive: true,
        autoDelete: true,
        passive: false,
        arguments: {
          job_key: correlation.job_key,
          job_type: correlation.job_type
        }
      };

      // Use the default 'amqueue.topic' exchange
      this.connection.queue( correlation.key, _options, function have_correlation_queue( queue ) {
        Rabbit.debug( 'Created Correlation Queue [%s] for job key [%s].', correlation.key, correlation.job_key )

        // Start Response correlation stream.
        response.call( correlation );

        // Bind to exchange with direct routing.
        queue.bind( Instance.get( 'exchange.name' ), correlation.key );

        // Receive a correlation message.
        queue.subscribe( Instance.get( 'options.correlation_subscription' ), function have_correlation_message( message, headers, info ) {
          Rabbit.debug( 'Received Correlation Queue (QC) [%s] job response type: [%s].', headers.correlation_key, headers.event )

          // Emit a correlation event.
          correlation.emit( headers.event, message, {
            id: info.messageId,
            message: message,
            format: info.contentType,
            headers: headers
          });

          // Destroy Correlation Queue on completion.
          if( headers.event === 'complete' ) {

            queue.destroy({
              ifUnused: false,
              ifEmpty: false
            });

          }

        });

      });

      // @chainable.
      return this;

    },
    enumerable: true,
    writable: true,
    configurable: true
  },
  define: {
    get: function() { return this.registerJob },
    enumerable: false,
    configurable: true
  },
  run: {
    get: function() { return this.runJob },
    enumerable: false,
    configurable: true
  },
  api: {
    /**
     * Make RabbitMQ API Request
     *
     * @example
     *
     *    // Get Vhosts
     *    Instance.api( 'get', 'vhosts', console.log );
     *
     *    // Get queues
     *    Instance.api( 'get', 'queues', console.log );
     *
     * @async
     * @chainable
     * @param method
     * @param query
     * @param cb
     */
    value: function api( method, query, cb ) {

      Rabbit.request({
        url: Instance.get( 'settings.api' ) + '/vhosts',
        json: true,
        auth: {
          user: Instance.get( 'settings.login' ),
          pass: Instance.get( 'settings.password' )
        }
      }, function( error, req, body ) { cb( error, body ); });

      // Chainable.
      return this;

    },
    enumerable: true,
    writable: true,
    configurable: true
  }
});

// Rabit constructor properties.
Object.defineProperties( module.exports = Rabbit, {
  Job: {
    value: require( './job' ),
    enumerable: true,
    writable: true,
    configurable: true
  },
  Correlation: {
    value: require( './correlation' ),
    enumerable: true,
    writable: true,
    configurable: true
  },
  debug: {
    value: require( 'debug' )( 'rabbit' ),
    enumerable: false,
    writable: true,
    configurable: true
  },
  request: {
    value: require( 'request' ),
    enumerable: false,
    writable: true,
    configurable: true
  },
  extend: {
    value: require( 'extend' ),
    enumerable: false,
    writable: true,
    configurable: true
  },
  amqp: {
    value: require( 'amqp' ),
    enumerable: false,
    writable: true,
    configurable: true
  },
  defaults: {
    value: {
      exchange: 'node-rabbit',
      host: 'localhost',
      port: 5672,
      login: 'guest',
      password: 'guest',
      vhost: '/',
      reconnect: true,
      api: 'http://localhost:15672/api'
    },
    enumerable: false,
    writable: true,
    configurable: true
  },
  createConnection: {
    /**
     * Returns new instance of Rabbit.
     *
     * @param settings {Object} Configuration for connection.
     * @returns {Rabbit}
     */
    value: function createConnection ( settings, cb ) {
      return new Rabbit( settings, cb );
    },
    enumerable: true,
    writable: true,
    configurable: true
  }
});




