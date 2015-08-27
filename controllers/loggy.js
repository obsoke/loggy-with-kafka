'use strict';

var fs = require('fs'),
    kafka = require('kafka-node'),
    Producer = kafka.Producer,
    Consumer= kafka.Consumer,
    prodClient = new kafka.Client('localhost:2181/'),
    consClient = new kafka.Client('localhost:2181/'),
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

    producer.send(payload, function (err, data) {});
};

var logConsumer = function (message) {
    // todo: write log to app.log file
    var rawLogData = message.value;

    if (!rawLogData) throw Error('[loggy.js] No log data found!');

    var logData = JSON.parse(rawLogData);

    var logString = logData.actionId;
    if (logData.userId) logString += '::' + logData.userId;
    if (logData.data) logString += '->' + JSON.stringify(logData.data);
    logString += '\n';

    fs.appendFile('./app.log', logString, function(err) {
        if (err) throw Error('[loggy.js] Error writing log to file!');
    });
};

// set up consumer
consumer.on('message', logConsumer);

module.exports = {
    log: log
};
