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
_$jscoverage_init(_$jscoverage, "lib/client/activity.js",[13,14,18,19,23,25,28,31,39,43,128,217,220,242,243,246,247,250,266,292,293,304,318]);
_$jscoverage_init(_$jscoverage_cond, "lib/client/activity.js",[13,18,23,242,246,292]);
_$jscoverage["lib/client/activity.js"].source = ["/**"," * Create Activity"," *"," * The prototype must be registered prior to being initalized."," *"," * @param name {String} Unique identifier for Activity, used to configure queue names, correlation keys, etc."," * @returns {Activity}"," * @constructor"," */","function Activity( name ) {","","  // Make sure context is correct otherwise we could screw up the global scope.","  if( !( this instanceof Activity ) ) {","    return new Activity( name );","  }","","  // No name.","  if( 'string' !== typeof name ) {","    return this.error( new Error( 'The Activity name must be set.' ) );","  }","","  // Activie Already Exists.","  if( this.pool[ name ] ) {","    // @chainable","    return this.pool[ name ].debug( 'Activity instance [%s] restored.', name );","  }","","  this.debug( 'Initializing Activity [%s] for [%s] exchange.', name, this.exchange.name );","","  // Lockin Activity Instance Name","  Object.defineProperty( this, 'name', {","    value: name,","    enumerable: true,","    configurable: false,","    writable: false","  });","","  // @chainable","  return this.pool[ name ] = this;","","}","","Object.defineProperties( Activity.prototype, {","  name: {","    /**","     * Activity Name","     *","     * Prototype is considered unregistered until set.","     *","     */","    value: undefined,","    enumerable: true,","    configurable: true,","    writable: true","  },","  type: {","    /**","     * Activity Group / Type","     *","     * Prototype is considered unregistered until set.","     *","     */","    value: 'activity',","    enumerable: true,","    configurable: true,","    writable: true","  },","","  active: {","    /**","     * Activity Prototype Status","     *","     * Prototype is considered unregistered until set.","     *","     */","    value: false,","    enumerable: true,","    configurable: true,","    writable: true","  },","  connection: {","    /**","     * Activity Connection","     *","     * Prototype is considered unregistered until set.","     *","     */","    value: undefined,","    enumerable: true,","    configurable: true,","    writable: true","  },","  exchange: {","    /**","     * Activity Exchange","     *","     * Prototype is considered unregistered until set.","     *","     */","    value: undefined,","    enumerable: true,","    configurable: true,","    writable: true","  },","","  subscribe: {","    value: require( '../utility' ).subscribe,","    enumerable: true,","    configurable: true,","    writable: true","  },","  unsubscribe: {","    value: require( '../utility' ).unsubscribe,","    enumerable: true,","    configurable: true,","    writable: true","  },","  publish: {","    value: require( '../utility' ).publish,","    enumerable: true,","    configurable: true,","    writable: true","  },","","  message: {","    value: function message() {","","      Object.defineProperties( this, {","        id: {","          value: id,","          enumerable: true,","          configurable: true,","          writable: true","        },","        format: {","          value: data.format || 'application/json',","          enumerable: true,","          configurable: true,","          writable: true","        },","        correlation_key: {","          value: data.correlation_key,","          enumerable: true,","          configurable: true,","          writable: true","        },","        client: {","          value: data.client,","          enumerable: true,","          configurable: true,","          writable: true","        },","        routing: {","          value: data.routing,","          enumerable: true,","          configurable: true,","          writable: true","        },","        message: {","          value: this.unpack( data.message ),","          enumerable: true,","          configurable: true,","          writable: true","        },","        meta: {","          value: data.meta,","          enumerable: false,","          configurable: true,","          writable: true","        },","        queue: {","          value: data.queue,","          enumerable: false,","          configurable: true,","          writable: true","        },","        exchange: {","          value: data.exchange,","          enumerable: false,","          configurable: true,","          writable: true","        },","        rabbit: {","          value: data.rabbit,","          enumerable: false,","          configurable: true,","          writable: true","        },","        headers: {","          value: data.headers,","          enumerable: false,","          configurable: true,","          writable: true","        }","      });","","    },","    enumerable: true,","    configurable: true,","    writable: true","  },","  error: {","    value: require( '../utility' ).error,","    enumerable: true,","    configurable: true,","    writable: true","  },","  debug: {","    value: require( '../utility' ).debug,","    enumerable: true,","    configurable: true,","    writable: true","  }","","});","","Object.defineProperties( module.exports = Activity, {","  create: {","    value: function create() {","      return new Activity( arguments[0] );","    },","    enumerable: true,","    configurable: true,","    writable: true","  },","  utility: {","    value: require( '../utility' ),","    enumerable: false,","    writable: false","  },","  register: {","    /**","     * Initialize Prototype","     *","     * @param type {String}","     * @param settings","     * @returns {Function}","     */","    value: function register( type, settings, handler ) {","","      // If already registered do nothing.","      if( Activity.prototype.active ) {","        return Activity;","      }","","      if( !type ) {","        throw new Error( 'Can not register Activity without a valid type.' );","      }","","      var _exchange_settings = {","        type: 'topic',","        durable: settings.durable,","        confirm: settings.confirm,","        passive: settings.passive,","        autoDelete: settings.autoDelete || true, // Dump them.","        noDeclare: false, // @important If true will not create new exchange on first connection.","        arguments: {","          created: new Date().getTime()","        }","      }","","      /**","       * Update Prototype Properties.","       *","       */","      Object.defineProperties( Activity.prototype, {","        type: {","          /**","           * Set Activity Type - can not be changed","           *","           */","          value: type,","          enumerable: true,","          configurable: false,","          writable: false","        },","        active: {","          value: true,","          enumerable: true,","          configurable: false,","          writable: true","        },","        connection: {","          value: settings.connection,","          enumerable: false,","          configurable: false,","          writable: false","        },","        exchange: {","          value: settings.connection.exchange( type + '.topic', _exchange_settings, function have_exchange( exchange ) {","","            if( 'function' === typeof handler ) {","              new handler( Activity, exchange );","            }","","          }),","          enumerable: false,","          configurable: true,","          writable: false","        }","      });","","      // @chainable","      return Activity;","","    },","    enumerable: true,","    configurable: true,","    writable: true","  },","  exchange: {","    /**","     * Exchange Link","     *","     * @returns {boolean|debug|string}","     */","    get: function() {","      return Activity.prototype.exchange ? true : false;","    },","    enumerable: true,","    configurable: true","  },","  pool: {","    /**","     * Instance Pool","     *","     */","    value: {},","    enumerable: false,","    configurable: true,","    writable: true","  }","});"];
function Activity(name) {
    _$jscoverage_done("lib/client/activity.js", 13);
    if (_$jscoverage_done("lib/client/activity.js", 13, !(this instanceof Activity))) {
        _$jscoverage_done("lib/client/activity.js", 14);
        return new Activity(name);
    }
    _$jscoverage_done("lib/client/activity.js", 18);
    if (_$jscoverage_done("lib/client/activity.js", 18, "string" !== typeof name)) {
        _$jscoverage_done("lib/client/activity.js", 19);
        return this.error(new Error("The Activity name must be set."));
    }
    _$jscoverage_done("lib/client/activity.js", 23);
    if (_$jscoverage_done("lib/client/activity.js", 23, this.pool[name])) {
        _$jscoverage_done("lib/client/activity.js", 25);
        return this.pool[name].debug("Activity instance [%s] restored.", name);
    }
    _$jscoverage_done("lib/client/activity.js", 28);
    this.debug("Initializing Activity [%s] for [%s] exchange.", name, this.exchange.name);
    _$jscoverage_done("lib/client/activity.js", 31);
    Object.defineProperty(this, "name", {
        value: name,
        enumerable: true,
        configurable: false,
        writable: false
    });
    _$jscoverage_done("lib/client/activity.js", 39);
    return this.pool[name] = this;
}

_$jscoverage_done("lib/client/activity.js", 43);
Object.defineProperties(Activity.prototype, {
    name: {
        value: undefined,
        enumerable: true,
        configurable: true,
        writable: true
    },
    type: {
        value: "activity",
        enumerable: true,
        configurable: true,
        writable: true
    },
    active: {
        value: false,
        enumerable: true,
        configurable: true,
        writable: true
    },
    connection: {
        value: undefined,
        enumerable: true,
        configurable: true,
        writable: true
    },
    exchange: {
        value: undefined,
        enumerable: true,
        configurable: true,
        writable: true
    },
    subscribe: {
        value: require("../utility").subscribe,
        enumerable: true,
        configurable: true,
        writable: true
    },
    unsubscribe: {
        value: require("../utility").unsubscribe,
        enumerable: true,
        configurable: true,
        writable: true
    },
    publish: {
        value: require("../utility").publish,
        enumerable: true,
        configurable: true,
        writable: true
    },
    message: {
        value: function message() {
            _$jscoverage_done("lib/client/activity.js", 128);
            Object.defineProperties(this, {
                id: {
                    value: id,
                    enumerable: true,
                    configurable: true,
                    writable: true
                },
                format: {
                    value: data.format || "application/json",
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
                    value: this.unpack(data.message),
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
    error: {
        value: require("../utility").error,
        enumerable: true,
        configurable: true,
        writable: true
    },
    debug: {
        value: require("../utility").debug,
        enumerable: true,
        configurable: true,
        writable: true
    }
});

_$jscoverage_done("lib/client/activity.js", 217);
Object.defineProperties(module.exports = Activity, {
    create: {
        value: function create() {
            _$jscoverage_done("lib/client/activity.js", 220);
            return new Activity(arguments[0]);
        },
        enumerable: true,
        configurable: true,
        writable: true
    },
    utility: {
        value: require("../utility"),
        enumerable: false,
        writable: false
    },
    register: {
        value: function register(type, settings, handler) {
            _$jscoverage_done("lib/client/activity.js", 242);
            if (_$jscoverage_done("lib/client/activity.js", 242, Activity.prototype.active)) {
                _$jscoverage_done("lib/client/activity.js", 243);
                return Activity;
            }
            _$jscoverage_done("lib/client/activity.js", 246);
            if (_$jscoverage_done("lib/client/activity.js", 246, !type)) {
                _$jscoverage_done("lib/client/activity.js", 247);
                throw new Error("Can not register Activity without a valid type.");
            }
            _$jscoverage_done("lib/client/activity.js", 250);
            var _exchange_settings = {
                type: "topic",
                durable: settings.durable,
                confirm: settings.confirm,
                passive: settings.passive,
                autoDelete: settings.autoDelete || true,
                noDeclare: false,
                arguments: {
                    created: (new Date).getTime()
                }
            };
            _$jscoverage_done("lib/client/activity.js", 266);
            Object.defineProperties(Activity.prototype, {
                type: {
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
                    value: settings.connection.exchange(type + ".topic", _exchange_settings, function have_exchange(exchange) {
                        _$jscoverage_done("lib/client/activity.js", 292);
                        if (_$jscoverage_done("lib/client/activity.js", 292, "function" === typeof handler)) {
                            _$jscoverage_done("lib/client/activity.js", 293);
                            new handler(Activity, exchange);
                        }
                    }),
                    enumerable: false,
                    configurable: true,
                    writable: false
                }
            });
            _$jscoverage_done("lib/client/activity.js", 304);
            return Activity;
        },
        enumerable: true,
        configurable: true,
        writable: true
    },
    exchange: {
        get: function() {
            _$jscoverage_done("lib/client/activity.js", 318);
            return Activity.prototype.exchange ? true : false;
        },
        enumerable: true,
        configurable: true
    },
    pool: {
        value: {},
        enumerable: false,
        configurable: true,
        writable: true
    }
});