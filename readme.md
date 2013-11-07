Node.js module for RabbitMQ-controlled job and session management.

## Overview

  - [Creating Activities](#creating-activities)

## Semantics

  - Activity
  - Correlation
  - Workflow
  - Session
  - Exchange
  - Queue
  - Virtual Host

## Registering Activities
Define an activity by specifying a unique name and a callback method.
The activity will be registered within the client and a corresponding queue will be created and associated with the exchange.

```js
client.registerActivity( 'generate-pdf', function generatePDF() {


});
```
## Processing Activities
The registered activities may then be started from any Rabbit Client that is connected to the broker where an activity was registered.
client.startActivity( 'generate-pdf', function generatePDF() {


});

{
  contentType: 'application/json',
  headers: {
    correlation_key: 'correlation.6bnd8g14t7nl8fr',
    activity_type: 'api/generate-key'
  },
  deliveryMode: 2,
  correlationId: '6bnd8g14t7nl8fr',
  replyTo: 'nty822paalsxajor',
  messageId: '9a4q0eqxcvc59udi',
  type: 'activity:api/generate-key',
  appId: '48927',
  queue: 'activity:api/generate-key',
  deliveryTag: <Buffer 00 00 00 00 00 00 00 01>,
  redelivered: false,
  exchange: 'example',
  routingKey: 'activity:api/generate-key',
  consumerTag: 'node-amqp-48948-0.5767979223746806' }

## Environment Variables

  - RABBIT_URL - e.g. amqp://guest:guest@localhost:5672/
  - RABBIT_LOGIN - e.g. guest
  - RABBIT_PASSWORD - e.g. guest
  - RABBIT_VHOST - e.g. guest

## Debugging
The module uses the debug module and emits logs in the "rabbit:client" namespace.

## Resources
  - [AMQP Concepts](http://www.rabbitmq.com/tutorials/amqp-concepts.html)

## License

(The MIT License)

Copyright (c) 2013 Usability Dynamics, Inc. &lt;info@usabilitydynamics.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.