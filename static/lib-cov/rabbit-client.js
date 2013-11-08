// instrument by jscoverage, do not modifly this file
(function () {
  var BASE;
  if (typeof global === 'object') {
    BASE = global;
  } else if (typeof window === 'object') {
    BASE = window;
  } else {
    throw new Error('[jscoverage] unknow ENV!');
  }
  if (!BASE._$jscoverage) {
    BASE._$jscoverage = {};
    BASE._$jscoverage_cond = {};
    BASE._$jscoverage_done = function (file, line, express) {
      if (arguments.length === 2) {
        BASE._$jscoverage[file][line] ++;
      } else {
        BASE._$jscoverage_cond[file][line] ++;
        return express;
      }
    };
    BASE._$jscoverage_init = function (base, file, lines) {
      var tmp = [];
      for (var i = 0; i < lines.length; i ++) {
        tmp[lines[i]] = 0;
      }
      base[file] = tmp;
    };
  }
})();
_$jscoverage_init(_$jscoverage, "lib/rabbit-client.js",[32,33,37,40,43,46,47,49,52,63,64,68,82,85,88,91,95,100,122,124,127,141,142,144,145,148,153,154,157,158,163,171,172,175,179,182,192,193,200,218,219,220,222,224,225,228,229,230,232,233,235,242,268,269,273,275,294,295,299,302,312,344,346,348,359,360,364,365,369,370,374,375,379,380,384,393,403,446,458]);
_$jscoverage_init(_$jscoverage_cond, "lib/rabbit-client.js",[32,63,148,224,228,228,268,294,344,344,359,364,369,374,379]);
_$jscoverage["lib/rabbit-client.js"].source = ["/**"," * Rabbit Client"," *"," * The Rabbit works, or else the Rabbit gets fucked; proper fucked, that is"," *"," * ## Events"," * - connection           : General connection event - could be an error or a success."," * - connection.success   : Successful connection event."," * - connection.error     : Connection failure."," * - error                : General error."," *"," * ## AMQP Events"," * - __connection.end"," * - __connection.finish"," * - __connection.connect"," * - __connection.data"," * - __connection.readable"," * - __connection.error"," * - __connection.ready"," *"," * @param handler {Function} Extendeble callback method."," * @returns {RabbitClient} Newly created Rabbit context."," * @version 0.1.0"," *"," * @async"," * @chainable"," * @constructor"," */","function RabbitClient() {","","  // Force Instance.","  if( !( this instanceof RabbitClient ) ) {","    return new RabbitClient( arguments[0] );","  }","","  // Clone Context.","  var context = this;","","  // If an object is passed instead of a function.","  var handler = 'function' === typeof arguments[0] ? arguments[0] : RabbitClient.utility.noop;","","  // Extend child's prototype with RabbitClient.","  RabbitClient.utility.inherits( handler, RabbitClient );","","  // Mixing external prototypes.","  RabbitClient.utility.settings( handler.prototype );","  RabbitClient.utility.emitter( handler.prototype );","","  try {","","    // Set computed and default sedttings.","    handler.prototype.set({","      name: require( '../package' ).name,","      version: require( '../package' ).version,","      directories: require( '../package' ).directories,","      settings: RabbitClient.utility.omit( RabbitClient.utility.defaults( handler, require( '../package' ).config ), 'super_'  ),","      environment: process.env.NODE_ENV || 'production',","      identity: String( process.pid ),","      connection: {}","    });","","    // Save URL connection string.","    if( 'string' === typeof arguments[0] ) {","      handler.prototype.set( 'settings.url', arguments[0] );","    }","","    // Extend context.","    Object.defineProperties( handler.prototype, {","      __queue: {","        /**","         * Action Queue","         *","         * @property __queue","         */","        value: {},","        enumerable: false,","        writable: true","      }","    });","","    // Invoke handler and overwrite context.","    context = new handler( null, null, RabbitClient );","","    // Parse Settings","    context.validate();","","    // Creates Connection.","    context.connect();","","  } catch( error ) {","    return new handler( error, RabbitClient ).error( error );","  }","","  // @chainable","  return context;","","}","","// Rabbit prototype properties.","Object.defineProperties( RabbitClient.prototype, {","  error: {","    value: require( './utility' ).error,","    configurable: true,","    enumerable: false,","    writable: true","  },","  debug: {","    value: require( './utility' ).debug,","    configurable: true,","    enumerable: true,","    writable: true","  },","  connect: {","    /**","     * Connect to Broker via AMQP","     *","     * @method connect","     * @for RabbitClient","     */","    value: function connect() {","","      var self = this;","","      this.debug( 'Connecting to [%s].', this.get( 'settings.url' ) );","","      // Connect via AMQP.","      this.set( 'connection', RabbitClient.utility.amqp.createConnection({","        host: this.get( 'settings.host' ),","        port: this.get( 'settings.port' ),","        login: this.get( 'settings.login', 'guest' ),","        password: this.get( 'settings.password', 'guest' ),","        clientProperties: {","          version: RabbitClient.version,","          platform: 'rabbit-client-' + RabbitClient.version,","          product: 'rabbit-client'","        },","        vhost: this.get( 'settings.vhost' )","      }, { defaultExchangeName: this.get( 'settings.exchænge', 'amq.topic' ), reconnect: this.get( 'settings.reconnect', true )} ) );","","      // RabbitClient _connection failed.","      this.get( 'connection' ).on( 'error', function error( error ) {","        self.debug( 'Connection error: [%s]:[%s]', error.message, error.code );","","        self.emit( 'connection', new Error( error.message ), self );","        self.emit( 'connection.error', new Error( error.message ), self );","","        // CONNECTION_FORCED - Closed via management plugin","        if( error.code === 320 ) {}","","      });","","      // RabbitClient connection established.","      this.get( 'connection' ).once( 'ready', function get_exchanges() {","        self.debug( 'Connection is ready.' );","","        // Emit connection success.","        self.emit( 'connection', null, self );","        self.emit( 'connection.success', null, self );","","        //console.log( 'RabbitClient.Activity.register', typeof RabbitClient.Activity.register );","","        // Register Activity Document","        RabbitClient.Activity.register( '_activity', {","          durable: true,","          confirm: false,","          passive: false,","          connection: self.get( 'connection' )","        });","","        // Some Activities","        RabbitClient.Activity.create( '/api/generate-pdf:v1' );","        RabbitClient.Activity.create( '/api/generate-pdf:v2' );","","        // Get Created","        RabbitClient.Activity.create( '/api/generate-pdf:v1' ).publish( 'work-request', {","          bells: 'whistles'","        });","","        return;","","        // Register Session Document","        RabbitClient.Session.register( '_session', {","          durable: true,","          confirm: false,","          passive: false,","          autoDelete: false,","          connection: self.get( 'connection' )","        }, function() {","","","          // Some Bulilshit Sessions","          RabbitClient.Session.create( 'usabilitydynamics.com' );","          RabbitClient.Session.create( 'terminallance.com.com' );","","        });","","      });","","      // @chainable","      return this;","","    },","    enumerable: true,","    writable: true","  },","  configure: {","    /**","     * Configure Client","     *","     * Method executed when connection is ready.","     * Usage and semantics emulating Express.","     *","     * @param env","     * @param callback","     * @returns {*}","     */","    value: function configure( env, callback ) {","      var self = this;","      var envs = 'all';","      var args = [].slice.call( arguments );","","      callback = args.pop();","","      if( args.length ) {","        envs = args;","      }","","      if( 'all' == envs || ~envs.indexOf( this.get( 'environment' ) ) ) {","        self.once( 'connection.success', function() {","          this.debug( 'Calling configuration callback [%s].', callback.name || 'no-name' );","","          try {","            callback.call( this, this, RabbitClient );","          } catch( error ) {","            this.error( error );","          }","","        });","      }","","      // @chainable","      return this;","","    },","    enumerable: true,","    writable: false","  },","  registerActivity: {","    /**","     * Regiser New Activity.","     *","     * - Instantiate Activity Type","     * - Subscribe to work-request queue.","     *","     *","     * @example","     *","     *    client.registerActivity( '/api/generate-key:v1', function Worker( req, res ) {","     *","     *    });","     *","     * @param name {String} Name of job type.","     * @param activity {Function} Function to process job.","     */","    value: function registerActivity( name, handler ) {","","      // Ensure Activity is registered","      if( !RabbitClient.Activity.ready ) {","        return this.error ? this.error( 'Can not call registerActivity - Activity is not active.' ) : new Error( 'processJob() was called out of context.' );","      }","","      // Create Activity Instance and subscribe to Work Requests, handler called in request/response context","      RabbitClient.Activity.create( name ).subscribe( 'work-request', handler );","","      return this;","","    },","    enumerable: true,","    writable: false","  },","  processJob: {","    /**","     * Publish a Work Request","     *","     * @method processJob","     * @chainable","     * @param name {String} Name of job type.","     * @param message {Object} Job parameters.","     * @param handler {Function} Callback method.","     */","    value: function processJob( name, message, handler ) {","","      // Ensure Activity is registered","      if( !RabbitClient.Activity.ready ) {","        return this.error ? this.error( 'Can not call processJob - Activity is not registered.' ) : new Error( 'processJob() was called out of context.' );","      }","","      // Create or load Activity.","      var _activity = RabbitClient.Activity.create( name );","","      // Send Work Request to Activity Work Queue.","      _activity.publish( 'work-request', message, {","        correlationId: 'unique-id-of-this-task',","        mandatory: true,","        immediate: true","      });","","      // Subscribe to Work Request queue","      // 'unique-id-of-this-task';","","      // @chainable.","      return this;","","    },","    enumerable: true,","    writable: true","  },","  getJob: {","    value: function createSession() {","","    },","    enumerable: true,","    writable: true","  },","  getSession: {","    value: function createSession() {","","    },","    enumerable: true,","    writable: true","  },","  validate: {","    /**","     * Validate Settings","     *","     * Attempts to fix broken settings and laod environment defaults.","     *","     * @method validate","     * @for RabbitClient","     */","    value: function validate() {","","      // Convert URL to Keys","      if( this.get( 'settings.url' ) || process.env.RABBIT_URL ) {","","        var _parse = RabbitClient.utility.url_parse( this.get( 'settings.url' ) || process.env.RABBIT_URL );","","        this.set( 'settings', RabbitClient.utility.defaults( this.get( 'settings' ), {","          host: _parse.hostname,","          port: _parse.port,","          login: _parse.auth ? _parse.auth.split( ':' )[0] : '',","          password: _parse.auth ? _parse.auth.split( ':' )[1] : '',","          vhost: _parse.pathname || '/'","        }));","","      }","","      // Set Host","      if( !this.get( 'settings.host' ) ) {","        this.set( 'settings.host', process.env.RABBIT_HOST );","      }","","      // Set Port","      if( !this.get( 'settings.port' ) ) {","        this.set( 'settings.port', process.env.RABBIT_PORT );","      }","","      // Set Login","      if( !this.get( 'settings.login' ) ) {","        this.set( 'settings.login', process.env.RABBIT_LOGIN );","      }","","      // Set Password","      if( !this.get( 'settings.password' ) ) {","        this.set( 'settings.password', process.env.RABBIT_LOGIN );","      }","","      // Create settings URL if it was not set","      if( !this.get( 'settings.url' ) ) {","        this.set( 'settings.url', [ 'amqp://', this.get( 'settings.host' ), ':', this.get( 'settings.port' ), this.get( 'settings.vhost' ) ].join( '' ) )","      }","","      // @chainable","      return this;","","    },","    enumerable: false,","    writable: true","  }","});","","// Rabit constructor properties.","Object.defineProperties( module.exports = RabbitClient, {","  create: {","    /**","     * Returns new context of RabbitClient.","     *","     * @method create","     * @param handler {Object|Function} Handler method or configuration object for connection.","     * @returns {RabbitClient}","     */","    value: function create( handler ) {","      return new RabbitClient( handler );","    },","    enumerable: true,","    writable: false","  },","  Thing: {","    value: require( './client/thing' ),","    enumerable: true,","    writable: false","  },","  Activity: {","    value: require( './client/activity' ),","    enumerable: true,","    writable: false","  },","  Correlation: {","    value: require( './client/correlation' ),","    enumerable: true,","    writable: false","  },","  Job: {","    value: require( './client/job' ),","    enumerable: true,","    writable: false","  },","  Session: {","    value: require( './client/session' ),","    enumerable: true,","    writable: false","  },","  Service: {","    value: require( 'rabbit-service' ),","    enumerable: true,","    writable: false","  },","  startService: {","    /**","     * Create Service","     *","     * @method startService","     * @for RabbitClient","     */","    get: function startService() {","      return require( 'rabbit-service' ).create;","    },","    enumerable: true","  },","  createConnection: {","    /**","     * Create Connection","     *","     * @method startService","     * @for RabbitClient","     */","    get: function createConnection() {","      return require( 'rabbit-client' ).create;","    },","    enumerable: true","  },","  utility: {","    value: require( './utility' ),","    enumerable: false,","    writable: false","  },","  version: {","    /**","     * Module Version","     *","     * @attribute version","     * @type sring","     */","    value: require( '../package' ).version,","    enumerable: true,","    writable: false","  },","  _schemas: {","    /**","     * Schemas","     *","     * @attribute _schemas","     * @type object","     */","    value: {},","    enumerable: false,","    writable: false","  }","});","","","","",""];
function RabbitClient() {
    _$jscoverage_done("lib/rabbit-client.js", 32);
    if (_$jscoverage_done("lib/rabbit-client.js", 32, !(this instanceof RabbitClient))) {
        _$jscoverage_done("lib/rabbit-client.js", 33);
        return new RabbitClient(arguments[0]);
    }
    _$jscoverage_done("lib/rabbit-client.js", 37);
    var context = this;
    _$jscoverage_done("lib/rabbit-client.js", 40);
    var handler = "function" === typeof arguments[0] ? arguments[0] : RabbitClient.utility.noop;
    _$jscoverage_done("lib/rabbit-client.js", 43);
    RabbitClient.utility.inherits(handler, RabbitClient);
    _$jscoverage_done("lib/rabbit-client.js", 46);
    RabbitClient.utility.settings(handler.prototype);
    _$jscoverage_done("lib/rabbit-client.js", 47);
    RabbitClient.utility.emitter(handler.prototype);
    _$jscoverage_done("lib/rabbit-client.js", 49);
    try {
        _$jscoverage_done("lib/rabbit-client.js", 52);
        handler.prototype.set({
            name: require("../package").name,
            version: require("../package").version,
            directories: require("../package").directories,
            settings: RabbitClient.utility.omit(RabbitClient.utility.defaults(handler, require("../package").config), "super_"),
            environment: process.env.NODE_ENV || "production",
            identity: String(process.pid),
            connection: {}
        });
        _$jscoverage_done("lib/rabbit-client.js", 63);
        if (_$jscoverage_done("lib/rabbit-client.js", 63, "string" === typeof arguments[0])) {
            _$jscoverage_done("lib/rabbit-client.js", 64);
            handler.prototype.set("settings.url", arguments[0]);
        }
        _$jscoverage_done("lib/rabbit-client.js", 68);
        Object.defineProperties(handler.prototype, {
            __queue: {
                value: {},
                enumerable: false,
                writable: true
            }
        });
        _$jscoverage_done("lib/rabbit-client.js", 82);
        context = new handler(null, null, RabbitClient);
        _$jscoverage_done("lib/rabbit-client.js", 85);
        context.validate();
        _$jscoverage_done("lib/rabbit-client.js", 88);
        context.connect();
    } catch (error) {
        _$jscoverage_done("lib/rabbit-client.js", 91);
        return (new handler(error, RabbitClient)).error(error);
    }
    _$jscoverage_done("lib/rabbit-client.js", 95);
    return context;
}

_$jscoverage_done("lib/rabbit-client.js", 100);
Object.defineProperties(RabbitClient.prototype, {
    error: {
        value: require("./utility").error,
        configurable: true,
        enumerable: false,
        writable: true
    },
    debug: {
        value: require("./utility").debug,
        configurable: true,
        enumerable: true,
        writable: true
    },
    connect: {
        value: function connect() {
            _$jscoverage_done("lib/rabbit-client.js", 122);
            var self = this;
            _$jscoverage_done("lib/rabbit-client.js", 124);
            this.debug("Connecting to [%s].", this.get("settings.url"));
            _$jscoverage_done("lib/rabbit-client.js", 127);
            this.set("connection", RabbitClient.utility.amqp.createConnection({
                host: this.get("settings.host"),
                port: this.get("settings.port"),
                login: this.get("settings.login", "guest"),
                password: this.get("settings.password", "guest"),
                clientProperties: {
                    version: RabbitClient.version,
                    platform: "rabbit-client-" + RabbitClient.version,
                    product: "rabbit-client"
                },
                vhost: this.get("settings.vhost")
            }, {
                defaultExchangeName: this.get("settings.exchænge", "amq.topic"),
                reconnect: this.get("settings.reconnect", true)
            }));
            _$jscoverage_done("lib/rabbit-client.js", 141);
            this.get("connection").on("error", function error(error) {
                _$jscoverage_done("lib/rabbit-client.js", 142);
                self.debug("Connection error: [%s]:[%s]", error.message, error.code);
                _$jscoverage_done("lib/rabbit-client.js", 144);
                self.emit("connection", new Error(error.message), self);
                _$jscoverage_done("lib/rabbit-client.js", 145);
                self.emit("connection.error", new Error(error.message), self);
                _$jscoverage_done("lib/rabbit-client.js", 148);
                if (_$jscoverage_done("lib/rabbit-client.js", 148, error.code === 320)) {}
            });
            _$jscoverage_done("lib/rabbit-client.js", 153);
            this.get("connection").once("ready", function get_exchanges() {
                _$jscoverage_done("lib/rabbit-client.js", 154);
                self.debug("Connection is ready.");
                _$jscoverage_done("lib/rabbit-client.js", 157);
                self.emit("connection", null, self);
                _$jscoverage_done("lib/rabbit-client.js", 158);
                self.emit("connection.success", null, self);
                _$jscoverage_done("lib/rabbit-client.js", 163);
                RabbitClient.Activity.register("_activity", {
                    durable: true,
                    confirm: false,
                    passive: false,
                    connection: self.get("connection")
                });
                _$jscoverage_done("lib/rabbit-client.js", 171);
                RabbitClient.Activity.create("/api/generate-pdf:v1");
                _$jscoverage_done("lib/rabbit-client.js", 172);
                RabbitClient.Activity.create("/api/generate-pdf:v2");
                _$jscoverage_done("lib/rabbit-client.js", 175);
                RabbitClient.Activity.create("/api/generate-pdf:v1").publish("work-request", {
                    bells: "whistles"
                });
                _$jscoverage_done("lib/rabbit-client.js", 179);
                return;
                _$jscoverage_done("lib/rabbit-client.js", 182);
                RabbitClient.Session.register("_session", {
                    durable: true,
                    confirm: false,
                    passive: false,
                    autoDelete: false,
                    connection: self.get("connection")
                }, function() {
                    _$jscoverage_done("lib/rabbit-client.js", 192);
                    RabbitClient.Session.create("usabilitydynamics.com");
                    _$jscoverage_done("lib/rabbit-client.js", 193);
                    RabbitClient.Session.create("terminallance.com.com");
                });
            });
            _$jscoverage_done("lib/rabbit-client.js", 200);
            return this;
        },
        enumerable: true,
        writable: true
    },
    configure: {
        value: function configure(env, callback) {
            _$jscoverage_done("lib/rabbit-client.js", 218);
            var self = this;
            _$jscoverage_done("lib/rabbit-client.js", 219);
            var envs = "all";
            _$jscoverage_done("lib/rabbit-client.js", 220);
            var args = [].slice.call(arguments);
            _$jscoverage_done("lib/rabbit-client.js", 222);
            callback = args.pop();
            _$jscoverage_done("lib/rabbit-client.js", 224);
            if (_$jscoverage_done("lib/rabbit-client.js", 224, args.length)) {
                _$jscoverage_done("lib/rabbit-client.js", 225);
                envs = args;
            }
            _$jscoverage_done("lib/rabbit-client.js", 228);
            if (_$jscoverage_done("lib/rabbit-client.js", 228, "all" == envs) || _$jscoverage_done("lib/rabbit-client.js", 228, ~envs.indexOf(this.get("environment")))) {
                _$jscoverage_done("lib/rabbit-client.js", 229);
                self.once("connection.success", function() {
                    _$jscoverage_done("lib/rabbit-client.js", 230);
                    this.debug("Calling configuration callback [%s].", callback.name || "no-name");
                    _$jscoverage_done("lib/rabbit-client.js", 232);
                    try {
                        _$jscoverage_done("lib/rabbit-client.js", 233);
                        callback.call(this, this, RabbitClient);
                    } catch (error) {
                        _$jscoverage_done("lib/rabbit-client.js", 235);
                        this.error(error);
                    }
                });
            }
            _$jscoverage_done("lib/rabbit-client.js", 242);
            return this;
        },
        enumerable: true,
        writable: false
    },
    registerActivity: {
        value: function registerActivity(name, handler) {
            _$jscoverage_done("lib/rabbit-client.js", 268);
            if (_$jscoverage_done("lib/rabbit-client.js", 268, !RabbitClient.Activity.ready)) {
                _$jscoverage_done("lib/rabbit-client.js", 269);
                return this.error ? this.error("Can not call registerActivity - Activity is not active.") : new Error("processJob() was called out of context.");
            }
            _$jscoverage_done("lib/rabbit-client.js", 273);
            RabbitClient.Activity.create(name).subscribe("work-request", handler);
            _$jscoverage_done("lib/rabbit-client.js", 275);
            return this;
        },
        enumerable: true,
        writable: false
    },
    processJob: {
        value: function processJob(name, message, handler) {
            _$jscoverage_done("lib/rabbit-client.js", 294);
            if (_$jscoverage_done("lib/rabbit-client.js", 294, !RabbitClient.Activity.ready)) {
                _$jscoverage_done("lib/rabbit-client.js", 295);
                return this.error ? this.error("Can not call processJob - Activity is not registered.") : new Error("processJob() was called out of context.");
            }
            _$jscoverage_done("lib/rabbit-client.js", 299);
            var _activity = RabbitClient.Activity.create(name);
            _$jscoverage_done("lib/rabbit-client.js", 302);
            _activity.publish("work-request", message, {
                correlationId: "unique-id-of-this-task",
                mandatory: true,
                immediate: true
            });
            _$jscoverage_done("lib/rabbit-client.js", 312);
            return this;
        },
        enumerable: true,
        writable: true
    },
    getJob: {
        value: function createSession() {},
        enumerable: true,
        writable: true
    },
    getSession: {
        value: function createSession() {},
        enumerable: true,
        writable: true
    },
    validate: {
        value: function validate() {
            _$jscoverage_done("lib/rabbit-client.js", 344);
            if (_$jscoverage_done("lib/rabbit-client.js", 344, this.get("settings.url")) || _$jscoverage_done("lib/rabbit-client.js", 344, process.env.RABBIT_URL)) {
                _$jscoverage_done("lib/rabbit-client.js", 346);
                var _parse = RabbitClient.utility.url_parse(this.get("settings.url") || process.env.RABBIT_URL);
                _$jscoverage_done("lib/rabbit-client.js", 348);
                this.set("settings", RabbitClient.utility.defaults(this.get("settings"), {
                    host: _parse.hostname,
                    port: _parse.port,
                    login: _parse.auth ? _parse.auth.split(":")[0] : "",
                    password: _parse.auth ? _parse.auth.split(":")[1] : "",
                    vhost: _parse.pathname || "/"
                }));
            }
            _$jscoverage_done("lib/rabbit-client.js", 359);
            if (_$jscoverage_done("lib/rabbit-client.js", 359, !this.get("settings.host"))) {
                _$jscoverage_done("lib/rabbit-client.js", 360);
                this.set("settings.host", process.env.RABBIT_HOST);
            }
            _$jscoverage_done("lib/rabbit-client.js", 364);
            if (_$jscoverage_done("lib/rabbit-client.js", 364, !this.get("settings.port"))) {
                _$jscoverage_done("lib/rabbit-client.js", 365);
                this.set("settings.port", process.env.RABBIT_PORT);
            }
            _$jscoverage_done("lib/rabbit-client.js", 369);
            if (_$jscoverage_done("lib/rabbit-client.js", 369, !this.get("settings.login"))) {
                _$jscoverage_done("lib/rabbit-client.js", 370);
                this.set("settings.login", process.env.RABBIT_LOGIN);
            }
            _$jscoverage_done("lib/rabbit-client.js", 374);
            if (_$jscoverage_done("lib/rabbit-client.js", 374, !this.get("settings.password"))) {
                _$jscoverage_done("lib/rabbit-client.js", 375);
                this.set("settings.password", process.env.RABBIT_LOGIN);
            }
            _$jscoverage_done("lib/rabbit-client.js", 379);
            if (_$jscoverage_done("lib/rabbit-client.js", 379, !this.get("settings.url"))) {
                _$jscoverage_done("lib/rabbit-client.js", 380);
                this.set("settings.url", [ "amqp://", this.get("settings.host"), ":", this.get("settings.port"), this.get("settings.vhost") ].join(""));
            }
            _$jscoverage_done("lib/rabbit-client.js", 384);
            return this;
        },
        enumerable: false,
        writable: true
    }
});

_$jscoverage_done("lib/rabbit-client.js", 393);
Object.defineProperties(module.exports = RabbitClient, {
    create: {
        value: function create(handler) {
            _$jscoverage_done("lib/rabbit-client.js", 403);
            return new RabbitClient(handler);
        },
        enumerable: true,
        writable: false
    },
    Thing: {
        value: require("./client/thing"),
        enumerable: true,
        writable: false
    },
    Activity: {
        value: require("./client/activity"),
        enumerable: true,
        writable: false
    },
    Correlation: {
        value: require("./client/correlation"),
        enumerable: true,
        writable: false
    },
    Job: {
        value: require("./client/job"),
        enumerable: true,
        writable: false
    },
    Session: {
        value: require("./client/session"),
        enumerable: true,
        writable: false
    },
    Service: {
        value: require("rabbit-service"),
        enumerable: true,
        writable: false
    },
    startService: {
        get: function startService() {
            _$jscoverage_done("lib/rabbit-client.js", 446);
            return require("rabbit-service").create;
        },
        enumerable: true
    },
    createConnection: {
        get: function createConnection() {
            _$jscoverage_done("lib/rabbit-client.js", 458);
            return require("rabbit-client").create;
        },
        enumerable: true
    },
    utility: {
        value: require("./utility"),
        enumerable: false,
        writable: false
    },
    version: {
        value: require("../package").version,
        enumerable: true,
        writable: false
    },
    _schemas: {
        value: {},
        enumerable: false,
        writable: false
    }
});