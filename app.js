'use strict'

let reekoh = require('reekoh')
let _plugin = new reekoh.plugins.Connector()
let async = require('async')
let isArray = require('lodash.isarray')
let isEmpty = require('lodash.isempty')
let isPlainObject = require('lodash.isplainobject')
let smtpClient = null
let sendData = (data, callback) => {
  if (isEmpty(data.sender)) { data.sender = _plugin.config.defaultSender }

  if (isEmpty(data.receiver)) {
    data.receiver = _plugin.config.defaultReceiver
  }

  if (isEmpty(data.htmlMessage)) {
    data.message = _plugin.config.defaultHtmlMessage
  }

  if (isEmpty(data.textMessage)) {
    data.message = _plugin.config.defaultTextMessage
  }

  if (isEmpty(data.subject)) {
    data.subject = _plugin.config.defaultSubject
  }

  var mailOptions = {
    from: data.sender,
    to: data.receiver,
    subject: data.subject,
    html: data.htmlMessage,
    text: data.textMessage
  }

  if (!isEmpty(data.cc)) {
    mailOptions.cc = data.cc
  }

  if (!isEmpty(data.bcc)) {
    mailOptions.bcc = data.bcc
  }

  smtpClient.sendMail(mailOptions, (error) => {
    if (!error) {
      _plugin.log(JSON.stringify({
        title: 'SMTP Email sent.',
        data: data
      }))
    }

    callback(error)
  })
}

/**
 * Emitted when device data is received.
 * This is the event to listen to in order to get real-time data feed from the connected devices.
 * @param {object} data The data coming from the device represented as JSON Object.
 */
_plugin.on('data', (data) => {
  if (isPlainObject(data)) {
    sendData(data, (error) => {
      if (error) {
        console.error(error)
        _plugin.logException(error)
      }
    })
  } else if (isArray(data)) {
    async.each(data, (datum, done) => {
      sendData(datum, done)
    }, (error) => {
      if (error) {
        console.error(error)
        _plugin.logException(error)
      }
    })
  } else {
    _plugin.logException(new Error('Invalid data received. Must be a valid Array/JSON Object. Data ' + data))
  }
})

/**
 * Emitted when the platform bootstraps the plugin. The plugin should listen once and execute its init process.
 */
_plugin.once('ready', () => {
  let clientOptions = {
    host: _plugin.config.host,
    secure: _plugin.config.ssl,
    auth: {
      user: _plugin.config.email,
      pass: _plugin.config.password
    },
    connectionTimeout: 15000
  }

  if (_plugin.config.smtpPort !== 'undefined') {
    clientOptions.port = _plugin.config.smtpPort
  }

  let nodemailer = require('nodemailer')

  smtpClient = nodemailer.createTransport(clientOptions)
  _plugin.log('SMTP Connector has been initialized.')
  _plugin.emit('init')
})

module.exports = _plugin
