/**
 * Rabbit Client
 *
 * The Rabbit works, or else the Rabbit gets fucked; proper fucked, that is
 *
 * ## Events
 * - connection           : General connection event - could be an error or a success.
 * - connection.success   : Successful connection event.
 * - connection.error     : Connection failure.
 * - error                : General error.
 *
 * ## AMQP Events
 * - _connection.end
 * - _connection.finish
 * - _connection.connect
 * - _connection.data
 * - _connection.readable
 * - _connection.error
 * - _connection.ready
 *
 * @param handler {Function} Extendeble callback method.
 * @returns {RabbitClient} Newly created Rabbit context.
 * @version 0.1.0
 *
 * @async
 * @chainable
 * @constructor
 */
function RabbitClient() {

  // Force Instance.
  if( !( this instanceof RabbitClient ) ) {
    return new RabbitClient( arguments[0] );
  }

  // Clone Context.
  var context = this;

  // If an object is passed instead of a function.
  var handler = 'function' === typeof arguments[0] ? arguments[0] : RabbitClient.utility.noop;

  // Extend child's prototype with RabbitClient.
  RabbitClient.utility.inherits( handler, RabbitClient );

  // Mixing external prototypes.
  RabbitClient.utility.settings( handler.prototype );
  RabbitClient.utility.emitter( handler.prototype );

  try {

    // Set computed and default sedttings.
    handler.prototype.set({
      settings: RabbitClient.utility.omit( RabbitClient.utility.defaults( handler, require( '../package' ).config ), 'super_'  ),
      module_root: RabbitClient.utility.dirname( RabbitClient.utility.dirname( module.filename ) ),
      environment: process.env.NODE_ENV || 'production',
      identity: String( process.pid ),
      debug: false,
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
      debug: {
        value: RabbitClient.utility.debug([ 'rabbit', 'client', handler.prototype.get( 'settings.exchange', '' ) ].join( ':' )),
        enumerable: false,
        writable: true
      },
      _connection: {
        /**
         * Connection Object
         *
         * @property _connection
         */
        value: {},
        enumerable: true,
        writable: true
      },
      _queue: {
        /**
         * Action Queue
         *
         * @property _queue
         */
        value: {},
        enumerable: false,
        writable: true
      },
      _jobs: {
        /**
         * Registered Jobs
         *
         * @property _jobs
         */
        value: {},
        enumerable: false,
        writable: true
      }
    });

    // Invoke handler and overwrite context.
    context = new handler( null, null, RabbitClient );

    context.debug( 'Creating client.' );

    // Parse Settings
    context.validate();

    // Creates this._connection
    context.connect();

    // RabbitClient _connection failed.
    context._connection.once( 'error', function error( error ) {
      context.emit( 'connection', new Error( error.message ), context );
      context.emit( 'connection.error', new Error( error.message ), context );
    });

    // RabbitClient connection established.
    context._connection.once( 'ready', context.is_ready.bind( context ) );

    // Save instance.
    RabbitClient._instance[ context.get( 'settings.name' ) ] = context;

  } catch( error ) {
    return new handler( error, RabbitClient ).error( error );
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

      // Create settings URL if it was not set
      if( !this.get( 'settings.url' ) ) {
        this.set( 'settings.url', [ 'amqp://', this.get( 'settings.host' ), ':', this.get( 'settings.port' ), this.get( 'settings.vhost' ) ].join( '' ) )
      }

      this.debug( 'Connecting to [%s].', this.get( 'settings.url' ) );

      // Connect via AMQP.
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

      // Silence the AMQP bug
      this._connection.setMaxListeners( 50 );

      // @chainable
      return this;

    },
    enumerable: true,
    writable: true
  },
  log: {
    /**
     * Logger
     *
     * @method log
     * @chainable
     * @returns {*}
     */
    value: function log() {

      // @todo Replace with winston
      console.log.apply( console, arguments );

      // @chainable
      return this

    },
    enumerable: false,
    writable: true
  },
  error: {
    value: function error( error ) {

      if( 'string' === typeof error ) {
        error = new Error( error );
      }

      // Debug error.
      this.debug( error );

      // Log error.
      this.log( "Rabbit Client Error: [%s][%s]", error.message, error.code );

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
  is_ready: {
    /**
     *
     * @param connection
     * @returns {*|error|string}
     */
    value: function is_ready( connection ) {
      this.debug( 'Connection to [%s] established.', this.get( 'settings.url' ) );

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
      };

      // Create/Update Exchange.
      this._connection.exchange( self.get( 'settings.exchange' ), _options, function have_exchange() {

        // Set Exchange Variables.
        self.set( 'exchange', this );

        // Emit connection success.
        self.emit( 'connection', null, self );
        self.emit( 'connection.success', null, self );

      });

      // @chainable
      return this;

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
     * @param callback
     * @returns {*}
     */
    value: function configure( env, callback ) {
      var self = this;
      var envs = 'all';
      var args = [].slice.call( arguments );

      callback = args.pop();

      if( args.length ) {
        envs = args;
      }

      if( 'all' == envs || ~envs.indexOf( this.get( 'environment' ) ) ) {
        self.once( 'connection.success', function() {
          this.debug( 'Calling configuration callback [%s].', callback.name || 'no-name' );

          try {
            callback.call( this, this, RabbitClient );
          } catch( error ) {
            this.error( error );
          }

        });
      }

      // @chainable
      return this;

    },
    enumerable: true,
    writable: false
  },
  registerActivity: {
    /**
     * Define a job.
     *
     * @param name {String} Name of job type.
     * @param activity {Function} Function to process job.
     */
    value: function registerActivity( job_type, activity ) {

      if( !( this instanceof RabbitClient ) ) {
        return RabbitClient.prototype.error( new Error( 'RabbitClient.prototype.registerActivity() can not be called out of context.' ) );
      }

      var self = this;

      // No name.
      if( 'string' !== typeof job_type ) {
        return this.error( new Error( 'The job type must be set.' ) );
      }

      // Job already exists
      if( this._jobs[ job_type ] ) {
        return this.error( new Error( 'The given job type is already registered.' ) );
      }

      if( 'function' !== typeof activity ) {
        return this.error( new Error( 'The second argument of registerActivity() must be a function.' ) );
      }

      self.debug( 'Registering job [%s] in [%s] exchange.', job_type, this.get( 'exchange.name' ) );

      // Job Queue Options.
      var _options = {
        durable: true,
        exclusive: false,
        closeChannelOnUnsubscribe: false,
        noDeclare: true,
        autoDelete: true,
        passive: false,
        arguments: {
          routing_key: [ 'job', job_type ].join( ':' ),
          type: job_type
        }
      };

      // Use the default 'amqueue.topic' exchange
      this._connection.queue( _options.arguments.routing_key, _options, function have_queue( job_queue ) {
        self.debug( 'Monitoring [%s/%s].', self.get( 'exchange.name' ), _options.arguments.routing_key );

        // Save job's activity to job pool
        self._jobs[ job_type ] = activity;

        // Bind to exchange with routing of "job"
        job_queue.bind( self.get( 'exchange.name' ), _options.arguments.routing_key );

        // Receive messages
        job_queue.subscribe( self.get( 'options.job_subscription' ), function( message, headers, info  ) {

          // Verify job can be handled.
          if( !info.type || !this._jobs[ info.type ] || 'function' !== typeof this._jobs[ info.type ] ) {
            return this.error( new Error( 'Received message is for a job type that is not registerd.' ) );
          }

          // Acknowledge Receipt.
          if( this.get( 'options.job_subscription.ack' ) ) {
            queue.shift();
          }

          // Handle work.
          this.handle_request( info.type, message, headers, info, queue );

        });

        queue.destroy({
          ifUnused: false,
          ifEmpty: false
        });

      });

    },
    enumerable: true,
    writable: false
  },
  handle_request: {
    /**
     *
     * @param job_type {String}
     * @param message
     * @param headers
     * @param info
     * @param queue
     */
    value: function handle_request( job_type, message, headers, info, queue ) {
      this.debug( 'Handling incoming work request for job [%s] in [%s] exchange.', job_type, this.get( 'exchange.name' ) );

      // Create Job instance from incoming message.
      var job = RabbitClient.Job.create({
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
        headers: headers,
        rabbit: this
      });

      // Call the Job Worker callback.
      try {

        this._jobs[ job.type ].call( job, job.message, function complete_wrapper( error, response ) {
          return job.complete( error, response );
        });

      } catch( error ) { return this.error( error ); }

      // @chainable
      return this;

    },
    enumerable: false,
    writable: false
  },
  startActivity: {
    /**
     * Run a job.
     *
     * @method startActivity
     * @chainable
     * @param job_type {String} Name of job type.
     * @param message {Object} Job data.
     * @param response {Function} Callback method.
     */
    value: function startActivity( job_type, message, response ) {

      if( !( this instanceof RabbitClient ) ) {
        return RabbitClient.prototype.error( new Error( 'RabbitClient.prototype.startActivity() can not be called out of context.' ) );
      }

      this.debug( 'Running job [%s] on [%s].', job_type, this.get( 'settings.url' ) );

      if( 'function' !== typeof response ) {
        return new Error( 'Response must be a method' );
      }

      var self = this;

      var correlation = RabbitClient.Correlation.create({
        sid: Math.random().toString( 36 ).substring( 2 ),
        mid: Math.random().toString( 36 ).substring( 2 ),
        format: 'application/json',
        job_key: [ 'job', job_type ].join( ':' ),
        job_type: job_type
      });

      this.get( 'exchange' ).publish( correlation.job_key, message, {
        appId: this.get( 'identity' ),
        correlationId: correlation.id,
        type: correlation.job_key,
        messageId: correlation.mid,
        replyTo: correlation.sid,
        contentType: correlation.format,
        deliveryMode: 2,
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
      this._connection.queue( correlation.key, _options, function have_correlation_queue( queue ) {
        self.debug( 'Created Correlation Queue [%s] for job key [%s].', correlation.key, correlation.job_key )

        // Start Response correlation stream.
        response.call( correlation, correlation );

        // Listen for force-kill
        correlation.once( 'kill', function kill() {
          self.debug( 'Killing Correlation Queue (QC).' );

          queue.destroy({
            ifUnused: false,
            ifEmpty: false
          });

        });

        // Bind to exchange with direct routing.
        queue.bind( self.get( 'exchange.name' ), correlation.key );

        // Receive a correlation message.
        queue.subscribe( self.get( 'options.correlation_subscription' ), function have_correlation_message( message, headers, info ) {
          self.debug( 'Received Correlation Queue (QC) [%s] job response type: [%s].', headers.correlation_key, headers.event );

          // Emit a correlation event.
          correlation.emit( headers.event, null, message, {
            id: info.messageId,
            message: message,
            format: info.contentType,
            headers: headers
          });

          // Destroy Correlation Queue on completion.
          if( headers.event === 'complete' ) {
            correlation.emit( 'kill' );
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

        this.set( 'settings', RabbitClient.utility.defaults( this.get( 'settings' ), {
          host: _parse.hostname,
          port: _parse.port,
          login: _parse.auth.split( ':' )[0],
          password: _parse.auth.split( ':' )[1],
          vhost: _parse.pathname || '/'
        }));

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

      // Exchange is required.
      if( !this.get( 'settings.exchange' ) ) {
        this.get( 'settings.exchange', process.env.RABBIT_EXCHANGE || 'amq.topic' )
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
  utility: {
    value: require( './utility' ),
    enumerable: false,
    writable: false
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



