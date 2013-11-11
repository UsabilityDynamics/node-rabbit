/**
 * Mocha Test for Rabbit Session Store
 *
 * mocha test/session-store.js --reporter list --ui exports --watch
 *
 * @author potanin@UD
 * @date 8/10/13
 * @type {Object}
 */
module.exports = {

  'before': function() {

    require( 'colors' );
    require( 'express' );

    // Default RabbitMQ Credentials
    Object.defineProperties( process.env, {
      RABBIT_LOGIN: { value: process.env.RABBIT_LOGIN || 'guest' },
      RABBIT_PASSWORD: { value: process.env.RABBIT_PASSWORD || 'guest' },
      RABBIT_URL: { value: process.env.RABBIT_URL || 'amqp://guest:guest@localhost:5672' }
    });

  },

  'Rabbit Client Session Storage': {

    /**
     *
     *
     */
    'has expected properties.': function() {

    }

  }

};