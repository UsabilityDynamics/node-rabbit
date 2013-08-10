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

  },

  'Rabbit API': {

    /**
     *
     *
     */
    'has expected properties.': function() {
      var Rabbit = require( '../' );

      // Constructor properties.
      Rabbit.should.have.property( 'debug' );
      Rabbit.should.have.property( 'request' );
      Rabbit.should.have.property( 'amqp' );
      Rabbit.should.have.property( 'extend' );
      Rabbit.should.have.property( 'defaults' );
      Rabbit.should.have.property( 'prototype' );
      Rabbit.should.have.property( 'createConnection' );

      Rabbit.should.have.property( 'Correlation' );
      Rabbit.should.have.property( 'Job' );

      // Prototype properties.
      Rabbit.prototype.should.have.property( 'configure' );
      Rabbit.prototype.should.have.property( 'registerJob' );
      Rabbit.prototype.should.have.property( 'runJob' );

      // Shortcuts.
      Rabbit.prototype.should.have.property( 'define' );
      Rabbit.prototype.should.have.property( 'run' );

      // Message properties.
      Rabbit.Correlation.prototype.should.have.property( 'timeout' );

      // Job properties.
      Rabbit.Job.prototype.should.have.property( 'progress' );
      Rabbit.Job.prototype.should.have.property( 'complete' );

    },

    'can establish a RabbitMQ connection and use configure() method.': function( done ) {
      this.timeout( 5000 );

      var Rabbit = require( '../' );
      var Client = require( '../' ).createConnection({ login: process.env.RABBIT_LOGIN, password: process.env.RABBIT_PASSWORD });

      Client.configure( function configure( client ) {

        this.should.have.property( 'get' );
        this.should.have.property( 'set' );
        this.should.have.property( 'registerJob' );
        this.should.have.property( 'runJob' );

        client.should.have.property( 'get' );
        client.should.have.property( 'set' );
        client.should.have.property( 'registerJob' );
        client.should.have.property( 'runJob' );

        done();

      });

      Client.once( 'connection.error', function( error, data ) {
        done();
      });
    },

    'can establish a RabbitMQ connection.': function( done ) {
      this.timeout( 5000 );

      var Rabbit = require( '../' );
      var Client = require( '../' ).createConnection({ login: process.env.RABBIT_LOGIN, password: process.env.RABBIT_PASSWORD });

      Client.once( 'connection.success', function() {
        done();
      });

      Client.once( 'connection.error', function( error, data ) {
        done();
      });

    }

  }

};