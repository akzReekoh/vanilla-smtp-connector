'use strict';

var platform = require('./platform'),
    isEmpty = require('lodash.isempty'),
    isArray = require('lodash.isarray'),
    async = require('async'),
    isPlainObject = require('lodash.isplainobject'),
	config,
    smtpClient;

let sendData = (data, callback) => {
    if(isEmpty(data.sender))
        data.sender = config.default_sender;

    if(isEmpty(data.receiver))
        data.receiver = config.default_receiver;

    if(isEmpty(data.message_html))
        data.message = config.default_html_message;

    if(isEmpty(data.message_text))
        data.message = config.default_text_message;

    if(isEmpty(data.subject))
        data.subject = config.default_subject;

    var mail_options = {
        from: data.sender,
        to: data.receiver,
        subject: data.subject,
        html: data.html_message,
        text: data.text_message
    };

    if(!isEmpty(data.cc))
        mail_options.cc = data.cc;

    if(!isEmpty(data.bcc))
        mail_options.bcc = data.bcc;

    smtpClient.sendMail(mail_options, function(error, info) {
        if(!error){
            platform.log(JSON.stringify({
                title: 'SMTP Email sent.',
                data: data
            }));
        }

        callback(error);
    });
};

platform.on('data', function (data) {
    if(isPlainObject(data)){
        sendData(data, (error) => {
            if(error) {
                console.error(error);
                platform.handleException(error);
            }
        });
    }
    else if(isArray(data)){
        async.each(data, (datum, done) => {
            sendData(datum, done);
        }, (error) => {
            if(error) {
                console.error(error);
                platform.handleException(error);
            }
        });
    }
    else
        platform.handleException(new Error('Invalid data received. Must be a valid Array/JSON Object. Data ' + data));
});

platform.once('close', function () {
    platform.notifyClose();
});

platform.once('ready', function (options) {
    config = options;

    var client_options = {
        host: options.host,
        secure: options.ssl,
        auth: {
            user: options.email,
            pass: options.password
        },
        connectionTimeout: 15000
    };

    if(options.smtp_port !== 'undefined')
        client_options.port = options.smtp_port;

   var  nodemailer = require('nodemailer');

    smtpClient = nodemailer.createTransport(client_options);

	platform.notifyReady();
	platform.log('Connector has been initialized.');
});