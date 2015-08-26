'use strict';

var kafka = require('kafka-node'),
    Producer = kafka.Producer,
    Consumer= kafka.Consumer,
    prodClient = new kafka.Client(),
    consClient = new kafka.Client(),
    producer = new Producer(prodClient),
    consumer = new Consumer(consClient, [{topic: 'logs'}]);

var log = function(logData) {
    var message = {};

    message.actionId = logData.actionId;
    if (logData.userId) message.userId = logData.userId;
    if (logData.data) message.data = logData.data;

    logProducer(message);
};

var logProducer = function (message) {
    var payload = [{
        topic: 'logs',
        messages: JSON.stringify(message)
    }];

    producer.send(payload, function (err, data) {
        console.log(data);
    });
};

var logConsumer = function (message) {
    // todo: write log to app.log file
};

// set up consumer
consumer.on('message', logConsumer);

module.exports = {
    log: log
};
