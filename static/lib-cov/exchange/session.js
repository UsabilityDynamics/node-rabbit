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
_$jscoverage_init(_$jscoverage, "lib/exchange/session.js",[13,14,18,19,23,30,33,38,138]);
_$jscoverage_init(_$jscoverage_cond, "lib/exchange/session.js",[13,18]);
_$jscoverage["lib/exchange/session.js"].source = ["/**"," * Session Queues"," *"," * The prototype must be registered prior to being initalized."," *"," * @param name {String} Unique identifier for Session, used to configure queue names, correlation keys, etc."," * @returns {Session}"," * @constructor"," */","function Session( name ) {","","  // Make sure context is correct otherwise we could screw up the global scope.","  if( !( this instanceof Session ) ) {","    return Session.create( name );","  }","","  // No name.","  if( 'string' !== typeof name ) {","    return this.error( new Error( 'The Session name must be set.' ) );","  }","","  // Lockin Session Instance Name","  Object.defineProperty( this, 'name', {","    value: name,","    enumerable: true,","    configurable: false,","    writable: false","  });","","  this.debug( 'Initializing Session [%s] for [%s] exchange.', name, this.exchange.name );","","  // @chainable","  return this;","","}","","// Session Instance Properties.","Object.defineProperties( Session.prototype, {","  name: {","    /**","     * Session Name","     *","     * Prototype is considered unregistered until set.","     *","     */","    value: undefined,","    enumerable: true,","    configurable: true,","    writable: true","  },","  type: {","    /**","     * Session Group / Type","     *","     * Prototype is considered unregistered until set.","     *","     */","    value: 'activity',","    enumerable: true,","    configurable: true,","    writable: true","  },","  connection: {","    /**","     * Session Connection","     *","     * Prototype is considered unregistered until set.","     *","     */","    value: undefined,","    enumerable: true,","    configurable: true,","    writable: true","  },","  exchange: {","    /**","     * Session Exchange","     *","     * Prototype is considered unregistered until set.","     *","     */","    value: undefined,","    enumerable: true,","    configurable: true,","    writable: true","  },","  create_context: {","    value: require( '../exchange' ).prototype.create_context,","    enumerable: true,","    configurable: true,","    writable: true","  },","  subscribe: {","    value: require( '../exchange' ).prototype.subscribe,","    enumerable: true,","    configurable: true,","    writable: true","  },","  request: {","    value: require( '../exchange' ).prototype.request,","    enumerable: true,","    configurable: true,","    writable: true","  },","  response: {","    value: require( '../exchange' ).prototype.response,","    enumerable: true,","    configurable: true,","    writable: true","  },","  unsubscribe: {","    value: require( '../exchange' ).prototype.unsubscribe,","    enumerable: true,","    configurable: true,","    writable: true","  },","  publish: {","    value: require( '../exchange' ).prototype.publish,","    enumerable: true,","    configurable: true,","    writable: true","  },","  error: {","    value: require( '../utility' ).error,","    enumerable: true,","    configurable: true,","    writable: true","  },","  debug: {","    value: require( '../utility' ).debug,","    enumerable: true,","    configurable: true,","    writable: true","  }","});","","// Session Constructor Properties.","Object.defineProperties( module.exports = Session, {","  create: {","    value: require( '../exchange' ).create,","    enumerable: true,","    configurable: true,","    writable: true","  },","  utility: {","    value: require( '../utility' ),","    enumerable: false,","    writable: false","  },","  declare: {","    value: require( '../exchange' ).declare,","    enumerable: true,","    configurable: true,","    writable: true","  }","});"];
function Session(name) {
    _$jscoverage_done("lib/exchange/session.js", 13);
    if (_$jscoverage_done("lib/exchange/session.js", 13, !(this instanceof Session))) {
        _$jscoverage_done("lib/exchange/session.js", 14);
        return Session.create(name);
    }
    _$jscoverage_done("lib/exchange/session.js", 18);
    if (_$jscoverage_done("lib/exchange/session.js", 18, "string" !== typeof name)) {
        _$jscoverage_done("lib/exchange/session.js", 19);
        return this.error(new Error("The Session name must be set."));
    }
    _$jscoverage_done("lib/exchange/session.js", 23);
    Object.defineProperty(this, "name", {
        value: name,
        enumerable: true,
        configurable: false,
        writable: false
    });
    _$jscoverage_done("lib/exchange/session.js", 30);
    this.debug("Initializing Session [%s] for [%s] exchange.", name, this.exchange.name);
    _$jscoverage_done("lib/exchange/session.js", 33);
    return this;
}

_$jscoverage_done("lib/exchange/session.js", 38);
Object.defineProperties(Session.prototype, {
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
    create_context: {
        value: require("../exchange").prototype.create_context,
        enumerable: true,
        configurable: true,
        writable: true
    },
    subscribe: {
        value: require("../exchange").prototype.subscribe,
        enumerable: true,
        configurable: true,
        writable: true
    },
    request: {
        value: require("../exchange").prototype.request,
        enumerable: true,
        configurable: true,
        writable: true
    },
    response: {
        value: require("../exchange").prototype.response,
        enumerable: true,
        configurable: true,
        writable: true
    },
    unsubscribe: {
        value: require("../exchange").prototype.unsubscribe,
        enumerable: true,
        configurable: true,
        writable: true
    },
    publish: {
        value: require("../exchange").prototype.publish,
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

_$jscoverage_done("lib/exchange/session.js", 138);
Object.defineProperties(module.exports = Session, {
    create: {
        value: require("../exchange").create,
        enumerable: true,
        configurable: true,
        writable: true
    },
    utility: {
        value: require("../utility"),
        enumerable: false,
        writable: false
    },
    declare: {
        value: require("../exchange").declare,
        enumerable: true,
        configurable: true,
        writable: true
    }
});