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
_$jscoverage_init(_$jscoverage, "lib/utility.js",[7,13,25,26,29,30,33,40,41,44,52,69,71,72,75,78,84,89,92,95,98,101,117,126,128,129,133,150,151,153,154,157,172,174,175,180,190,191,194,209,210,214,215,219,222,223,227]);
_$jscoverage_init(_$jscoverage_cond, "lib/utility.js",[25,25,29,71,71,128,128,153,153,172,190,209,214,222]);
_$jscoverage["lib/utility.js"].source = ["/**"," * RabbitMQ Client Utility Methods"," *"," * @class Utility"," * @uses Abstract"," */","var Utility = require( 'abstract' ).utility;","","/**"," * Extra Utility Methods"," *"," */","Object.defineProperties( module.exports = Utility, {","  debug: {","    /**","     * Debug Method","     *","     * Initialized method that uses the instance's \"name\" property, or constructor name, to identify","     * debug namespace. Caches instance in __debug.","     *","     * @returns {boolean|debug|string}","     */","    get: function get() {","","      if( !this.name && !this.constructor.name ) {","        return console.error( new Error( 'Tried to initialize utility.debug() on an object without a name.' ) );","      }","","      if( !Object.getOwnPropertyDescriptor( this, 'debug' ).configurable ) {","        return console.error( new Error( 'Treid to initialize debug but the property is not configurable.' ) );","      }","","      Object.defineProperty( this, 'debug', {","        /**","         * Debug","         *","         * @returns {*}","         */","        value: function debug() {","          var debug = this.__debug = this.__debug || require( 'debug' )([ 'rabbit', 'client', this.name || this.constructor.name  ].join( ':' ))","          debug.apply( this, arguments );","","          // @chainable","          return this;","","        },","        writable: false,","        configurable: false,","        enumerable: true","      });","","      return this.debug;","","","    },","    enumerable: true,","    configurable: true","  },","  subscribe: {","    /**","     * Subscribe to Pattern","     *","     * @param pattern","     * @param handler","     * @param options {Object}","     * @returns {*}","     */","    value: function subscribe( pattern, handler, options ) {","      this.debug( '%s.subscribe(%s)', this.name, pattern );","","      if( !this.connection || !this.exchange ) {","        throw Error( 'Connectedion not ready.' );","      }","","      var self = this;","","      // Queue Defaults","      options = Utility.defaults( options || {}, {","        durable: true,","        exclusive: false","      });","","      // Create a self-named queue","      this.connection.queue( this.name, options, function( queue ) {","","        // find out what self.channel is","","        // Bind Exchange with topic \"pattern\"","        queue.bind( self.exchange, pattern );","","        // @debug","        console.log( \"created queue\", this.name, \"bound to pattern\", pattern );","","        // Hadle messages.","        queue.subscribe( function have_message( message ) {","","          // Print messages to stdout","          console.log( \"have_message:\", message );","","          // Call Handler in request/response context","          handler.call({","            time: undefined,","            debug: function() {}","          }, {","            get: function() {},","            param: function() {}","          }, {","            send: function() {},","            set: function() {}","          });","","        });","","      });","","      // @chainable","      return this;","","    },","    enumerable: true,","    writable: true,","    configurable: true","  },","  unsubscribe: {","    value: function unsubscribe( consumer_tag ) {","      this.debug( '%s.unsubscribe(%s)', this.name, consumer_tag );","","      if( !this.connection || !this.exchange ) {","        throw Error( 'Connectedion not ready.' );","      }","","      // @chainable","      return this;","","    },","    enumerable: true,","    writable: true,","    configurable: true","  },","  publish: {","    /**","     * Publish Message to Exchange","     *","     * @param pattern {String} AMQP","     * @param message","     * @returns {*}","     */","    value: function publish( pattern, message, options ) {","","      this.debug( '%s.publish(%s,%s)', this.name, pattern, message );","      this.debug( '%s.publish(%s,%s)', this.name, pattern, message );","","      if( !this.connection || !this.exchange ) {","        throw Error( 'Connectedion not ready.' );","      }","","      options = Utility.defaults( options, {","        //appId: this.get( 'identity' ),","        type: this.type,","        //correlationId: correlation.id,","        messageId: Math.random().toString( 36 ).substring( 2 ),","        //replyTo: correlation.sid,","        // contentType: 'application/json',","        // deliveryMode: 2,","        headers: {","          // correlation_key: correlation.key,","          activity_type: this.type","        }","      });","","      // is confirmation required?","      if( this.exchange.confirm ) {}","","      this.exchange.publish( pattern, message, options ).once( 'ack', function() {","        console.log( 'PUBLISH:ACK' );","","      });","","      // @chainable","      return this;","","    },","    enumerable: true,","    writable: true,","    configurable: true","  },","  trim: {","    value: function( string ) {","","      if( Buffer === typeof string ) {","        string = string.toString();","      }","","      return require( 'string' )( string ).trim();","","    },","    configurable: false,","    enumerable: true,","    writable: true","  },","  error: {","    /**","     *","     * @param error","     * @returns {*}","     */","    value: function error( error ) {","","      if( 'string' === typeof error ) {","        error = new Error( error );","      }","","      // Debug error.","      if( this.debug ) {","        this.debug( error );","      }","","      // Log error.","      console.log( \"Rabbit Client Error: [%s][%s]\", error.message, error.code );","","      // Emit error.","      if( this.emit ) {","        this.emit( 'error', error );","      }","","      // @chainable","      return this;","","    },","    enumerable: false,","    writable: true","  },","  msgpack: {","    value: require( 'msgpack' ),","    enumerable: true,","    writable: true,","    configurable: true","  },","  async: {","    value: require( 'async' ),","    enumerable: true,","    writable: true,","    configurable: true","  },","  winston: {","    value: require( 'winston' ),","    enumerable: true,","    writable: true,","    configurable: true","  },","  amqp: {","    value: require( 'amqp' ),","    enumerable: true,","    writable: true,","    configurable: true","  },","  dirname: {","    value: require( 'path' ).dirname,","    enumerable: true,","    writable: true,","    configurable: true","  },","  spawn: {","    value: require( 'child_process' ).spawn,","    configurable: false,","    enumerable: true,","    writable: true","  },","  defaults: {","    value: require( 'lodash' ).defaults,","    configurable: false,","    enumerable: true,","    writable: true","  },","  omit: {","    value: require( 'lodash' ).omit,","    configurable: false,","    enumerable: true,","    writable: true","  },","  inherits: {","    value: require( 'util' ).inherits,","    configurable: false,","    enumerable: true,","    writable: true","  },","  settings: {","    value: require( 'object-settings' ).mixin,","    configurable: false,","    enumerable: true,","    writable: true","  },","  validate: {","    value: require( 'object-validation' ).validate,","    configurable: false,","    enumerable: true,","    writable: true","  },","  emitter: {","    value: require( 'object-emitter' ).mixin,","    configurable: false,","    enumerable: true,","    writable: true","  },","  url_parse: {","    value: require( 'url' ).parse,","    configurable: false,","    enumerable: true,","    writable: true","  },","  request: {","    value: require( 'request' ),","    configurable: false,","    enumerable: true,","    writable: true","  }","});"];
_$jscoverage_done("lib/utility.js", 7);
var Utility = require("abstract").utility;

_$jscoverage_done("lib/utility.js", 13);
Object.defineProperties(module.exports = Utility, {
    debug: {
        get: function get() {
            _$jscoverage_done("lib/utility.js", 25);
            if (_$jscoverage_done("lib/utility.js", 25, !this.name) && _$jscoverage_done("lib/utility.js", 25, !this.constructor.name)) {
                _$jscoverage_done("lib/utility.js", 26);
                return console.error(new Error("Tried to initialize utility.debug() on an object without a name."));
            }
            _$jscoverage_done("lib/utility.js", 29);
            if (_$jscoverage_done("lib/utility.js", 29, !Object.getOwnPropertyDescriptor(this, "debug").configurable)) {
                _$jscoverage_done("lib/utility.js", 30);
                return console.error(new Error("Treid to initialize debug but the property is not configurable."));
            }
            _$jscoverage_done("lib/utility.js", 33);
            Object.defineProperty(this, "debug", {
                value: function debug() {
                    _$jscoverage_done("lib/utility.js", 40);
                    var debug = this.__debug = this.__debug || require("debug")([ "rabbit", "client", this.name || this.constructor.name ].join(":"));
                    _$jscoverage_done("lib/utility.js", 41);
                    debug.apply(this, arguments);
                    _$jscoverage_done("lib/utility.js", 44);
                    return this;
                },
                writable: false,
                configurable: false,
                enumerable: true
            });
            _$jscoverage_done("lib/utility.js", 52);
            return this.debug;
        },
        enumerable: true,
        configurable: true
    },
    subscribe: {
        value: function subscribe(pattern, handler, options) {
            _$jscoverage_done("lib/utility.js", 69);
            this.debug("%s.subscribe(%s)", this.name, pattern);
            _$jscoverage_done("lib/utility.js", 71);
            if (_$jscoverage_done("lib/utility.js", 71, !this.connection) || _$jscoverage_done("lib/utility.js", 71, !this.exchange)) {
                _$jscoverage_done("lib/utility.js", 72);
                throw Error("Connectedion not ready.");
            }
            _$jscoverage_done("lib/utility.js", 75);
            var self = this;
            _$jscoverage_done("lib/utility.js", 78);
            options = Utility.defaults(options || {}, {
                durable: true,
                exclusive: false
            });
            _$jscoverage_done("lib/utility.js", 84);
            this.connection.queue(this.name, options, function(queue) {
                _$jscoverage_done("lib/utility.js", 89);
                queue.bind(self.exchange, pattern);
                _$jscoverage_done("lib/utility.js", 92);
                console.log("created queue", this.name, "bound to pattern", pattern);
                _$jscoverage_done("lib/utility.js", 95);
                queue.subscribe(function have_message(message) {
                    _$jscoverage_done("lib/utility.js", 98);
                    console.log("have_message:", message);
                    _$jscoverage_done("lib/utility.js", 101);
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
            _$jscoverage_done("lib/utility.js", 117);
            return this;
        },
        enumerable: true,
        writable: true,
        configurable: true
    },
    unsubscribe: {
        value: function unsubscribe(consumer_tag) {
            _$jscoverage_done("lib/utility.js", 126);
            this.debug("%s.unsubscribe(%s)", this.name, consumer_tag);
            _$jscoverage_done("lib/utility.js", 128);
            if (_$jscoverage_done("lib/utility.js", 128, !this.connection) || _$jscoverage_done("lib/utility.js", 128, !this.exchange)) {
                _$jscoverage_done("lib/utility.js", 129);
                throw Error("Connectedion not ready.");
            }
            _$jscoverage_done("lib/utility.js", 133);
            return this;
        },
        enumerable: true,
        writable: true,
        configurable: true
    },
    publish: {
        value: function publish(pattern, message, options) {
            _$jscoverage_done("lib/utility.js", 150);
            this.debug("%s.publish(%s,%s)", this.name, pattern, message);
            _$jscoverage_done("lib/utility.js", 151);
            this.debug("%s.publish(%s,%s)", this.name, pattern, message);
            _$jscoverage_done("lib/utility.js", 153);
            if (_$jscoverage_done("lib/utility.js", 153, !this.connection) || _$jscoverage_done("lib/utility.js", 153, !this.exchange)) {
                _$jscoverage_done("lib/utility.js", 154);
                throw Error("Connectedion not ready.");
            }
            _$jscoverage_done("lib/utility.js", 157);
            options = Utility.defaults(options, {
                type: this.type,
                messageId: Math.random().toString(36).substring(2),
                headers: {
                    activity_type: this.type
                }
            });
            _$jscoverage_done("lib/utility.js", 172);
            if (_$jscoverage_done("lib/utility.js", 172, this.exchange.confirm)) {}
            _$jscoverage_done("lib/utility.js", 174);
            this.exchange.publish(pattern, message, options).once("ack", function() {
                _$jscoverage_done("lib/utility.js", 175);
                console.log("PUBLISH:ACK");
            });
            _$jscoverage_done("lib/utility.js", 180);
            return this;
        },
        enumerable: true,
        writable: true,
        configurable: true
    },
    trim: {
        value: function(string) {
            _$jscoverage_done("lib/utility.js", 190);
            if (_$jscoverage_done("lib/utility.js", 190, Buffer === typeof string)) {
                _$jscoverage_done("lib/utility.js", 191);
                string = string.toString();
            }
            _$jscoverage_done("lib/utility.js", 194);
            return require("string")(string).trim();
        },
        configurable: false,
        enumerable: true,
        writable: true
    },
    error: {
        value: function error(error) {
            _$jscoverage_done("lib/utility.js", 209);
            if (_$jscoverage_done("lib/utility.js", 209, "string" === typeof error)) {
                _$jscoverage_done("lib/utility.js", 210);
                error = new Error(error);
            }
            _$jscoverage_done("lib/utility.js", 214);
            if (_$jscoverage_done("lib/utility.js", 214, this.debug)) {
                _$jscoverage_done("lib/utility.js", 215);
                this.debug(error);
            }
            _$jscoverage_done("lib/utility.js", 219);
            console.log("Rabbit Client Error: [%s][%s]", error.message, error.code);
            _$jscoverage_done("lib/utility.js", 222);
            if (_$jscoverage_done("lib/utility.js", 222, this.emit)) {
                _$jscoverage_done("lib/utility.js", 223);
                this.emit("error", error);
            }
            _$jscoverage_done("lib/utility.js", 227);
            return this;
        },
        enumerable: false,
        writable: true
    },
    msgpack: {
        value: require("msgpack"),
        enumerable: true,
        writable: true,
        configurable: true
    },
    async: {
        value: require("async"),
        enumerable: true,
        writable: true,
        configurable: true
    },
    winston: {
        value: require("winston"),
        enumerable: true,
        writable: true,
        configurable: true
    },
    amqp: {
        value: require("amqp"),
        enumerable: true,
        writable: true,
        configurable: true
    },
    dirname: {
        value: require("path").dirname,
        enumerable: true,
        writable: true,
        configurable: true
    },
    spawn: {
        value: require("child_process").spawn,
        configurable: false,
        enumerable: true,
        writable: true
    },
    defaults: {
        value: require("lodash").defaults,
        configurable: false,
        enumerable: true,
        writable: true
    },
    omit: {
        value: require("lodash").omit,
        configurable: false,
        enumerable: true,
        writable: true
    },
    inherits: {
        value: require("util").inherits,
        configurable: false,
        enumerable: true,
        writable: true
    },
    settings: {
        value: require("object-settings").mixin,
        configurable: false,
        enumerable: true,
        writable: true
    },
    validate: {
        value: require("object-validation").validate,
        configurable: false,
        enumerable: true,
        writable: true
    },
    emitter: {
        value: require("object-emitter").mixin,
        configurable: false,
        enumerable: true,
        writable: true
    },
    url_parse: {
        value: require("url").parse,
        configurable: false,
        enumerable: true,
        writable: true
    },
    request: {
        value: require("request"),
        configurable: false,
        enumerable: true,
        writable: true
    }
});