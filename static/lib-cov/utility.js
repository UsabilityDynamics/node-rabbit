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
_$jscoverage_init(_$jscoverage, "lib/utility.js",[7,13,23,24,27,43,44,47,65,66,69,70,73,81,82,90,93,101,110,111,114,129,130,134,135,139,142,143,147]);
_$jscoverage_init(_$jscoverage_cond, "lib/utility.js",[23,43,65,65,69,81,110,129,134,142]);
_$jscoverage["lib/utility.js"].source = ["/**"," * RabbitMQ Client Utility Methods"," *"," * @class Utility"," * @uses Abstract"," */","var Utility = require( 'abstract' ).utility;","","/**"," * Extra Utility Methods"," *"," */","Object.defineProperties( module.exports = Utility, {","  pack: {","    /**","     * Pack String","     *","     * @param string","     * @returns {*}","     */","    value: function pack( message ) {","","      if( message instanceof Buffer ) {","        message = message.toString();","      }","","      return module.exports.utility.msgpack.pack( message );","","    },","    enumerable: true,","    configurable: true,","    writable: true","  },","  unpack: {","    /**","     * Unpack Message","     *","     * @param string","     * @returns {*}","     */","    value: function unpack( message ) {","","      if( string instanceof Buffer ) {","        string = string.toString();","      }","","      return module.exports.utility.msgpack.unpack( message );","","    },","    enumerable: true,","    configurable: true,","    writable: true","  },","  debug: {","    /**","     * Debug Method","     *","     * Initialized method that uses the instance's \"name\" property, or constructor name, to identify","     * debug namespace. Caches instance in __debug.","     *","     * @returns {boolean|debug|string}","     */","    get: function get() {","","      if( !this.name && !this.constructor.name ) {","        return console.error( new Error( 'Tried to initialize utility.debug() on an object without a name.' ) );","      }","","      if( !Object.getOwnPropertyDescriptor( this, 'debug' ).configurable ) {","        return console.error( new Error( 'Treid to initialize debug but the property is not configurable.' ) );","      }","","      Object.defineProperty( this, 'debug', {","        /**","         * Debug","         *","         * @returns {*}","         */","        value: function debug() {","","          if( !this.__debug ) {","            Object.defineProperty( this, '__debug', {","              value: require( 'debug' )([ 'rabbit', 'client', this.type, this.name || this.constructor.name  ].join( ':' )),","              enumerable: false,","              configurable: true","            });","          }","","          // Apply.","          this.__debug.apply( this, arguments );","","          // @chainable","          return this;","","        },","        writable: false,","        configurable: false,","        enumerable: true","      });","","      return this.debug;","","    },","    enumerable: true,","    configurable: true","  },","  trim: {","    value: function( string ) {","","      if( Buffer === typeof string ) {","        string = string.toString();","      }","","      return require( 'string' )( string ).trim();","","    },","    configurable: false,","    enumerable: true,","    writable: true","  },","  error: {","    /**","     *","     * @param error","     * @returns {*}","     */","    value: function error( error ) {","","      if( 'string' === typeof error ) {","        error = new Error( error );","      }","","      // Debug error.","      if( this.debug ) {","        this.debug( error );","      }","","      // Log error.","      console.log( \"Rabbit Client Error: [%s][%s]\", error.message, error.code );","","      // Emit error.","      if( this.emit ) {","        this.emit( 'error', error );","      }","","      // @chainable","      return this;","","    },","    enumerable: false,","    writable: true","  },","  msgpack: {","    value: require( 'msgpack' ),","    enumerable: true,","    writable: true,","    configurable: true","  },","  async: {","    value: require( 'async' ),","    enumerable: true,","    writable: true,","    configurable: true","  },","  winston: {","    value: require( 'winston' ),","    enumerable: true,","    writable: true,","    configurable: true","  },","  amqp: {","    value: require( 'amqp' ),","    enumerable: true,","    writable: true,","    configurable: true","  },","  dirname: {","    value: require( 'path' ).dirname,","    enumerable: true,","    writable: true,","    configurable: true","  },","  spawn: {","    value: require( 'child_process' ).spawn,","    configurable: false,","    enumerable: true,","    writable: true","  },","  defaults: {","    value: require( 'lodash' ).defaults,","    configurable: false,","    enumerable: true,","    writable: true","  },","  omit: {","    value: require( 'lodash' ).omit,","    configurable: false,","    enumerable: true,","    writable: true","  },","  inherits: {","    value: require( 'util' ).inherits,","    configurable: false,","    enumerable: true,","    writable: true","  },","  settings: {","    value: require( 'object-settings' ).mixin,","    configurable: false,","    enumerable: true,","    writable: true","  },","  validate: {","    value: require( 'object-validation' ).validate,","    configurable: false,","    enumerable: true,","    writable: true","  },","  emitter: {","    value: require( 'object-emitter' ).mixin,","    configurable: false,","    enumerable: true,","    writable: true","  },","  url_parse: {","    value: require( 'url' ).parse,","    configurable: false,","    enumerable: true,","    writable: true","  }","});"];
_$jscoverage_done("lib/utility.js", 7);
var Utility = require("abstract").utility;

_$jscoverage_done("lib/utility.js", 13);
Object.defineProperties(module.exports = Utility, {
    pack: {
        value: function pack(message) {
            _$jscoverage_done("lib/utility.js", 23);
            if (_$jscoverage_done("lib/utility.js", 23, message instanceof Buffer)) {
                _$jscoverage_done("lib/utility.js", 24);
                message = message.toString();
            }
            _$jscoverage_done("lib/utility.js", 27);
            return module.exports.utility.msgpack.pack(message);
        },
        enumerable: true,
        configurable: true,
        writable: true
    },
    unpack: {
        value: function unpack(message) {
            _$jscoverage_done("lib/utility.js", 43);
            if (_$jscoverage_done("lib/utility.js", 43, string instanceof Buffer)) {
                _$jscoverage_done("lib/utility.js", 44);
                string = string.toString();
            }
            _$jscoverage_done("lib/utility.js", 47);
            return module.exports.utility.msgpack.unpack(message);
        },
        enumerable: true,
        configurable: true,
        writable: true
    },
    debug: {
        get: function get() {
            _$jscoverage_done("lib/utility.js", 65);
            if (_$jscoverage_done("lib/utility.js", 65, !this.name) && _$jscoverage_done("lib/utility.js", 65, !this.constructor.name)) {
                _$jscoverage_done("lib/utility.js", 66);
                return console.error(new Error("Tried to initialize utility.debug() on an object without a name."));
            }
            _$jscoverage_done("lib/utility.js", 69);
            if (_$jscoverage_done("lib/utility.js", 69, !Object.getOwnPropertyDescriptor(this, "debug").configurable)) {
                _$jscoverage_done("lib/utility.js", 70);
                return console.error(new Error("Treid to initialize debug but the property is not configurable."));
            }
            _$jscoverage_done("lib/utility.js", 73);
            Object.defineProperty(this, "debug", {
                value: function debug() {
                    _$jscoverage_done("lib/utility.js", 81);
                    if (_$jscoverage_done("lib/utility.js", 81, !this.__debug)) {
                        _$jscoverage_done("lib/utility.js", 82);
                        Object.defineProperty(this, "__debug", {
                            value: require("debug")([ "rabbit", "client", this.type, this.name || this.constructor.name ].join(":")),
                            enumerable: false,
                            configurable: true
                        });
                    }
                    _$jscoverage_done("lib/utility.js", 90);
                    this.__debug.apply(this, arguments);
                    _$jscoverage_done("lib/utility.js", 93);
                    return this;
                },
                writable: false,
                configurable: false,
                enumerable: true
            });
            _$jscoverage_done("lib/utility.js", 101);
            return this.debug;
        },
        enumerable: true,
        configurable: true
    },
    trim: {
        value: function(string) {
            _$jscoverage_done("lib/utility.js", 110);
            if (_$jscoverage_done("lib/utility.js", 110, Buffer === typeof string)) {
                _$jscoverage_done("lib/utility.js", 111);
                string = string.toString();
            }
            _$jscoverage_done("lib/utility.js", 114);
            return require("string")(string).trim();
        },
        configurable: false,
        enumerable: true,
        writable: true
    },
    error: {
        value: function error(error) {
            _$jscoverage_done("lib/utility.js", 129);
            if (_$jscoverage_done("lib/utility.js", 129, "string" === typeof error)) {
                _$jscoverage_done("lib/utility.js", 130);
                error = new Error(error);
            }
            _$jscoverage_done("lib/utility.js", 134);
            if (_$jscoverage_done("lib/utility.js", 134, this.debug)) {
                _$jscoverage_done("lib/utility.js", 135);
                this.debug(error);
            }
            _$jscoverage_done("lib/utility.js", 139);
            console.log("Rabbit Client Error: [%s][%s]", error.message, error.code);
            _$jscoverage_done("lib/utility.js", 142);
            if (_$jscoverage_done("lib/utility.js", 142, this.emit)) {
                _$jscoverage_done("lib/utility.js", 143);
                this.emit("error", error);
            }
            _$jscoverage_done("lib/utility.js", 147);
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
    }
});