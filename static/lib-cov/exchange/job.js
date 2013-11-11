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
_$jscoverage_init(_$jscoverage, "lib/exchange/job.js",[17,18,22,29,32,37,137]);
_$jscoverage_init(_$jscoverage_cond, "lib/exchange/job.js",[17]);
_$jscoverage["lib/exchange/job.js"].source = ["/**"," * Job Instance"," *"," * -"," *"," * @chainable"," *"," * @param data"," * @returns {*}"," * @constructor"," *"," * @author potanin@UD"," */","function Job( name ) {","","  // Make sure context is correct otherwise we could screw up the global scope.","  if( !( this instanceof Job ) ) {","    return Job.create( name );","  }","","  // Lockin Activity Instance Name","  Object.defineProperty( this, 'name', {","    value: name,","    enumerable: true,","    configurable: false,","    writable: false","  });","","  this.debug( 'Initializing Job [%s] for [%s] exchange.', name, this.exchange.name );","","  // @chainable","  return this.pool[ name ] = this;","","}","","// Job Prototype Properties.","Object.defineProperties( Job.prototype, {","  name: {","    /**","     * Activity Name","     *","     * Prototype is considered unregistered until set.","     *","     */","    value: undefined,","    enumerable: true,","    configurable: true,","    writable: true","  },","  type: {","    /**","     * Activity Group / Type","     *","     * Prototype is considered unregistered until set.","     *","     */","    value: 'activity',","    enumerable: true,","    configurable: true,","    writable: true","  },","  connection: {","    /**","     * Activity Connection","     *","     * Prototype is considered unregistered until set.","     *","     */","    value: undefined,","    enumerable: true,","    configurable: true,","    writable: true","  },","  exchange: {","    /**","     * Activity Exchange","     *","     * Prototype is considered unregistered until set.","     *","     */","    value: undefined,","    enumerable: true,","    configurable: true,","    writable: true","  },","  create_context: {","    value: require( '../exchange' ).prototype.create_context,","    enumerable: true,","    configurable: true,","    writable: true","  },","  request: {","    value: require( '../exchange' ).prototype.request,","    enumerable: true,","    configurable: true,","    writable: true","  },","  response: {","    value: require( '../exchange' ).prototype.response,","    enumerable: true,","    configurable: true,","    writable: true","  },","  subscribe: {","    value: require( '../exchange' ).prototype.subscribe,","    enumerable: true,","    configurable: true,","    writable: true","  },","  unsubscribe: {","    value: require( '../exchange' ).prototype.unsubscribe,","    enumerable: true,","    configurable: true,","    writable: true","  },","  publish: {","    value: require( '../exchange' ).prototype.publish,","    enumerable: true,","    configurable: true,","    writable: true","  },","  error: {","    value: require( '../utility' ).error,","    enumerable: true,","    configurable: true,","    writable: true","  },","  debug: {","    value: require( '../utility' ).debug,","    enumerable: true,","    configurable: true,","    writable: true","  }","});","","// Job Constructor Properties.","Object.defineProperties( module.exports = Job, {","  create: {","    value: require( '../exchange' ).create,","    enumerable: true,","    configurable: true,","    writable: true","  },","  utility: {","    value: require( '../utility' ),","    enumerable: false,","    writable: false","  },","  declare: {","    value: require( '../exchange' ).declare,","    enumerable: true,","    configurable: true,","    writable: true","  }","});"];
function Job(name) {
    _$jscoverage_done("lib/exchange/job.js", 17);
    if (_$jscoverage_done("lib/exchange/job.js", 17, !(this instanceof Job))) {
        _$jscoverage_done("lib/exchange/job.js", 18);
        return Job.create(name);
    }
    _$jscoverage_done("lib/exchange/job.js", 22);
    Object.defineProperty(this, "name", {
        value: name,
        enumerable: true,
        configurable: false,
        writable: false
    });
    _$jscoverage_done("lib/exchange/job.js", 29);
    this.debug("Initializing Job [%s] for [%s] exchange.", name, this.exchange.name);
    _$jscoverage_done("lib/exchange/job.js", 32);
    return this.pool[name] = this;
}

_$jscoverage_done("lib/exchange/job.js", 37);
Object.defineProperties(Job.prototype, {
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
    subscribe: {
        value: require("../exchange").prototype.subscribe,
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

_$jscoverage_done("lib/exchange/job.js", 137);
Object.defineProperties(module.exports = Job, {
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