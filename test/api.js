/**
 * Mocha Test for Rabbit api
 *
 * RABBIT_LOGIN=guest RABBIT_PASSWORD=guest mocha test/api.js --reporter list --ui exports --watch
 *
 * @author potanin@UD
 * @date 8/10/13
 * @type {Object}
 */
module.exports = {

  'before': function() {

    require( 'colors' );

    // Default RabbitMQ Credentials
    process.env.RABBIT_LOGIN = process.env.RABBIT_LOGIN || 'guest';
    process.env.RABBIT_PASSWORD = process.env.RABBIT_PASSWORD || 'guest';
    process.env.RABBIT_URL = process.env.RABBIT_URL || 'amqp://guest:guest@localhost:5672';

  },

  'Rabbit Client API': {

    /**
     *
     *
     */
    'has expected properties.': function() {

      var Rabbit = require( '.' );

      // Constructor properties.
      Rabbit.should.have.property( 'utility' );
      Rabbit.should.have.property( 'prototype' );
      Rabbit.should.have.property( 'create' );
      Rabbit.should.have.property( 'startService' );
      Rabbit.should.have.property( 'Job' );

      // Prototype properties.
      Rabbit.prototype.should.have.property( 'configure' );
      Rabbit.prototype.should.have.property( 'registerActivity' );
      Rabbit.prototype.should.have.property( 'processJob' );

      // Job properties.
      // Rabbit.Job.prototype.should.have.property( 'progress' );
      // Rabbit.Job.prototype.should.have.property( 'complete' );

    },

    'can establish a RabbitMQ connection and use configure() method.': function( done ) {
      this.timeout( 5000 );

      require( '.' ).create({ login: process.env.RABBIT_LOGIN, password: process.env.RABBIT_PASSWORD }).configure( function configure() {

        //this.should.have.property( '_connection' );
        //this.should.have.property( '_queue' );

        done();

      });

    },

    'can establish a RabbitMQ connection.': function( done ) {

      require( '.' ).create( function configure( error ) {

        this.should.have.property( 'get' );
        this.should.have.property( 'set' );

        done();

      });

    }

  }

};