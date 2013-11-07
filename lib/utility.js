/**
 * RabbitMQ Client Utility Methods
 *
 * @class Utility
 * @uses Abstract
 */
var Utility = require( 'abstract' ).utility;

/**
 * Extra Utility Methods
 *
 */
Object.defineProperties( module.exports = Utility, {
  async: {
    value: require( 'async' ),
    enumerable: true,
    writable: true,
    configurable: true
  },
  winston: {
    value: require( 'winston' ),
    enumerable: true,
    writable: true,
    configurable: true
  },
  amqp: {
    value: require( 'amqp' ),
    enumerable: true,
    writable: true,
    configurable: true
  },
  spawn: {
    value: require( 'child_process' ).spawn,
    configurable: false,
    enumerable: true,
    writable: true
  },
  defaults: {
    value: require( 'lodash' ).defaults,
    configurable: false,
    enumerable: true,
    writable: true
  },
  omit: {
    value: require( 'lodash' ).omit,
    configurable: false,
    enumerable: true,
    writable: true
  },
  inherits: {
    value: require( 'util' ).inherits,
    configurable: false,
    enumerable: true,
    writable: true
  },
  settings: {
    value: require( 'object-settings' ).mixin,
    configurable: false,
    enumerable: true,
    writable: true
  },
  validate: {
    value: require( 'object-validation' ).validate,
    configurable: false,
    enumerable: true,
    writable: true
  },
  emitter: {
    value: require( 'object-emitter' ).mixin,
    configurable: false,
    enumerable: true,
    writable: true
  },
  url_parse: {
    value: require( 'url' ).parse,
    configurable: false,
    enumerable: true,
    writable: true
  },
  request: {
    value: require( 'request' ),
    configurable: false,
    enumerable: true,
    writable: true
  }
});