/**
 * Rabbit Client
 *
 * The Rabbit works, or else the Rabbit gets fucked; proper fucked, that is
 *
 * ## Events
 * - connection: General connection event - could be an error or a success.
 * - connection.success: Successful connection event.
 * - connection.error: Connection failure.
 *
 * @param handler {Function} Extendeble callback method.
 * @returns {RabbitClient} Newly created Rabbit context.
 * @version 0.1.0
 *
 * @async
 * @chainable
 * @constructor
 */
function RabbitClient( handler ) {

  // Force Instance.
  if( !( this instanceof RabbitClient ) ) {
    return new RabbitClient( handler );
  }

  // Clone Context.
  var context = this;

  // If an object is passed instead of a function.
  if( 'function' !== typeof handler ) {
    handler = RabbitClient.utility.noop;
  }

  // Extend child's prototype with RabbitClient.
  RabbitClient.utility.inherits( handler, RabbitClient );

  // Mixing external prototypes.
  RabbitClient.utility.settings( handler.prototype );
  RabbitClient.utility.emitter( handler.prototype );

  try {

    // Set computed and default settings.
    handler.prototype.set({
      settings: RabbitClient.utility.omit( RabbitClient.utility.defaults( handler, require( '../package' ).config ), 'super_'  ),
      module_root: RabbitClient.utility.dirname( RabbitClient.utility.dirname( module.filename ) ),
      environment: process.env.NODE_ENV,
      identity: String( process.pid ),
      exchange: {},
      options: {
        job_subscription: {
          prefetchCount: 10,
          ack: true
        },
        correlation_subscription: {
          prefetchCount: 10,
          ack: true
        }
      }
    });

    // Save URL connection string.
    if( 'string' === typeof arguments[0] ) {
      handler.prototype.set( 'settings.url', arguments[0] );
    }

    // Extend context.
    Object.defineProperties( handler.prototype, {
      _connection: {
        /**
         *
         */
        value: {},
        enumerable: true,
        configurable: true,
        writable: true
      },
      _queue: {
        /**
         *
         */
        value: {},
        enumerable: true,
        configurable: true,
        writable: true
      }
    });

    // Invoke handler and overwrite context.
    context = new handler( null, this );

    // Parse Settings
    context.validate();

    // Creates this._connection
    context.connect();

    // RabbitClient _connection failed.
    context._connection.on( 'error', function error( error ) {
      context.emit( 'connection', new Error( error.message ), context );
      context.emit( 'connection.error', new Error( error.message ), context );
    });

    // RabbitClient connection established.
    context._connection.on( 'ready', context.is_ready.bind( context ) );

    // Save instance.
    RabbitClient._instance[ context.get( 'settings.name' ) ] = context;

  } catch( error ) {
      console.error( error );
      return context;
    }

  // @chainable
  return context;

}

// Rabbit prototype properties.
Object.defineProperties( RabbitClient.prototype, {
  connect: {
    /**
     * Connect via AMQP
     *
     */
    value: function connect() {

      this._connection = RabbitClient.utility.amqp.createConnection({
        host: this.get( 'settings.host' ),
        port: this.get( 'settings.port' ),
        login: this.get( 'settings.login', 'guest' ),
        password: this.get( 'settings.password', 'guest' ),
        vhost: this.get( 'settings.vhost' )
      }, {
        defaultExchangeName: this.get( 'settings.exchænge', '' ),
        reconnect: this.get( 'settings.reconnect', true )
      });

      return this;

    },
    enumerable: true,
    writable: true
  },
  debug: {
    value: require( 'debug' )( 'rabbit:client' ),
    enumerable: false,
    writable: true
  },
  log: {
    value: require( 'winston' ).log,
    enumerable: false,
    writable: true
  },
  is_ready: {
    value: function is_ready( connection ) {
      var self = this;

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
      this._connection.exchange( self.get( 'settings.exchange' ), _options, function have_exchange() {

        // Set Exchange Variables.
        self.set( 'exchange', this );

        // Emit connection success.
        self.emit( 'connection', null, self );
        self.emit( 'connection.success', null, self );

      });

    },
    enumerable: false,
    writable: true
  },
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
      var self = this;
      var envs = 'all';
      var args = [].slice.call( arguments );

      fn = args.pop();

      if( args.length ) {
        envs = args;
      }

      if( 'all' == envs || ~envs.indexOf( this.get( 'environment' ) ) ) {
        self.on( 'connection.success', fn.bind( this, this ) );
      }

      return this;

    },
    enumerable: true,
    writable: false
  },
  registerJob: {
    /**
     * Define a job.
     *
     * @param name {String} Name of job type.
     * @param fn {Function} Function to process job.
     */
    value: function registerJob( type, fn ) {

      var self = this;

      if( 'function' !== typeof fn ) {
        RabbitClient.debug( new Error( 'The second argument of registerJob() must be a function.' ) );
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
        RabbitClient.debug( 'Monitoring [%s/%s].', self.get( 'exchange.name' ), _options.arguments.routing_key );

        // Bind to exchange with routing of "job"
        queue.bind( self.get( 'exchange.name' ), _options.arguments.routing_key );

        // Receive messages
        queue.subscribe( self.get( 'options.job_subscription' ), function have_message( message, headers, info ) {

          // Acknowledge Receipt.
          if( self.get( 'options.job_subscription' ).ack ) {
            queue.shift();
          }

          // Create Job self.
          var job = RabbitClient.Job.create( {
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
            exchange: self.get( 'exchange' ),
            rabbit: self
          } )

          // Call the Job Worker callback.
          fn.call( job, job.message, function complete_wrapper( error, response ) {
            job.complete( error, response )
          } );

        } );

      } );

    },
    enumerable: true,
    writable: false
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

      var self = this;

      var correlation = RabbitClient.Correlation.create( {
        sid: Math.random().toString( 36 ).substring( 2 ),
        mid: Math.random().toString( 36 ).substring( 2 ),
        format: 'application/json',
        job_key: [ 'job', job_type ].join( '.' ),
        job_type: job_type
      } );

      this.get( 'exchange' ).publish( correlation.job_key, message, {
        correlationId: correlation.id,
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
      } );

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
        RabbitClient.debug( 'Created Correlation Queue [%s] for job key [%s].', correlation.key, correlation.job_key )

        // Start Response correlation stream.
        response.call( correlation );

        // Bind to exchange with direct routing.
        queue.bind( self.get( 'exchange.name' ), correlation.key );

        // Receive a correlation message.
        queue.subscribe( self.get( 'options.correlation_subscription' ), function have_correlation_message( message, headers, info ) {
          RabbitClient.debug( 'Received Correlation Queue (QC) [%s] job response type: [%s].', headers.correlation_key, headers.event )

          // Emit a correlation event.
          correlation.emit( headers.event, message, {
            id: info.messageId,
            message: message,
            format: info.contentType,
            headers: headers
          } );

          // Destroy Correlation Queue on completion.
          if( headers.event === 'complete' ) {

            queue.destroy( {
              ifUnused: false,
              ifEmpty: false
            } );

          }

        } );

      } );

      // @chainable.
      return this;

    },
    enumerable: true,
    writable: true,
    configurable: true
  },
  api: {
    /**
     * Make RabbitClient API Request
     *
     * @example
     *
     *    // Get Vhosts
     *    self.api( 'get', 'vhosts', console.log );
     *
     *    // Get queues
     *    self.api( 'get', 'queues', console.log );
     *
     * @async
     * @chainable
     * @param method
     * @param query
     * @param cb
     */
    value: function api( method, query, cb ) {

      RabbitClient.request( {
        url: self.get( 'settings.api' ) + '/vhosts',
        json: true,
        auth: {
          user: self.get( 'settings.login' ),
          pass: self.get( 'settings.password' )
        }
      }, function( error, req, body ) {
        cb( error, body );
      } );

      // Chainable.
      return this;

    },
    enumerable: true,
    writable: true,
    configurable: true
  },
  validate: {
    /**
     * Validate Settings
     *
     * Attempts to fix broken settings and laod environment defaults.
     *
     * @method validate
     * @for RabbitClient
     */
    value: function validate() {

      // Convert URL to Keys
      if( this.get( 'settings.url' ) || process.env.RABBIT_URL ) {

        var _parse = RabbitClient.utility.url_parse( this.get( 'settings.url' ) || process.env.RABBIT_URL );

        this.set( 'settings', {
          host: _parse.hostname,
          port: _parse.port,
          login: _parse.auth.split( ':' )[0],
          password: _parse.auth.split( ':' )[1],
          vhost: _parse.pathname || '/'
        });

      }

      // Set Host
      if( !this.get( 'settings.host' ) ) {
        this.set( 'settings.host', process.env.RABBIT_HOST );
      }

      // Set Port
      if( !this.get( 'settings.port' ) ) {
        this.set( 'settings.port', process.env.RABBIT_PORT );
      }

      // Set Login
      if( !this.get( 'settings.login' ) ) {
        this.set( 'settings.login', process.env.RABBIT_LOGIN );
      }

      // Set Password
      if( !this.get( 'settings.password' ) ) {
        this.set( 'settings.password', process.env.RABBIT_LOGIN );
      }

      // @chainable
      return this;

    },
    enumerable: false,
    writable: true
  }
});

// Rabit constructor properties.
Object.defineProperties( module.exports = RabbitClient, {
  Job: {
    value: require( './job' ),
    enumerable: false,
    writable: false
  },
  Correlation: {
    value: require( './correlation' ),
    enumerable: false,
    writable: false
  },
  Service: {
    value: require( 'rabbit-service' ),
    enumerable: false,
    writable: false
  },
  create: {
    /**
     * Returns new context of RabbitClient.
     *
     * @method create
     * @param handler {Object|Function} Handler method or configuration object for connection.
     * @returns {RabbitClient}
     */
    value: function create( handler ) {
      return new RabbitClient( handler );
    },
    enumerable: true,
    writable: false
  },
  utility: {
    value: require( './utility' ),
    enumerable: false,
    writable: false
  },
  startService: {
    /**
     * Create Service
     *
     * @method startService
     * @for RabbitClient
     */
    get: function startService() {
      return require( 'rabbit-service' ).create;
    },
    enumerable: true
  },
  createConnection: {
    /**
     * Create Connection
     *
     * @method startService
     * @for RabbitClient
     */
    get: function createConnection() {
      return require( 'rabbit-client' ).create;
    },
    enumerable: true
  },
  getInstance: {
    /**
     * Get Instance by PID
     *
     * @method create
     * @for RabbitService
     */
    value: function getInstance( pid ) {
      return RabbitService._instance ? RabbitService._instance[ pid ] : null;
    },
    enumerable: false
  },
  _schemas: {
    /**
     * Schemas
     *
     * @attribute _schemas
     * @type object
     */
    value: {},
    enumerable: false,
    writable: false
  },
  _instance: {
    /**
     * Instance Map
     *
     * @attribute _instance
     * @type object
     */
    value: {},
    enumerable: false,
    writable: true
  }
});




