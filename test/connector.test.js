'use strict'

const amqp = require('amqplib')

let _channel = null
let _conn = null
let app = null

describe('SMTP Connector Test', () => {
  before('init', () => {
    process.env.ACCOUNT = 'adinglasan'
    process.env.CONFIG = JSON.stringify({
      host: 'smtp.office365.com',
      smtpPort: '587',
      ssl: false,
      email: 'adinglasan@reekoh.com',
      password: 'Achilles?123',
      defaultHtmlMessage: 'Default HTML message.',
      defaultTextMessage: 'Default Text message.',
      defaultSender: 'adinglasan@reekoh.com',
      defaultReceiver: 'akzdinglasan@gmail.com',
      defaultSubject: 'Default subject'
    })
    process.env.INPUT_PIPE = 'ip.smtp'
    process.env.LOGGERS = 'logger1, logger2'
    process.env.EXCEPTION_LOGGERS = 'ex.logger1, ex.logger2'
    process.env.BROKER = 'amqp://guest:guest@127.0.0.1/'

    amqp.connect(process.env.BROKER)
      .then((conn) => {
        _conn = conn
        return conn.createChannel()
      }).then((channel) => {
      _channel = channel
    }).catch((err) => {
      console.log(err)
    })
  })

  after('close connection', function (done) {
    _conn.close()
    done()
  })

  describe('#start', function () {
    it('should start the app', function (done) {
      this.timeout(10000)
      app = require('../app')
      app.once('init', done)
    })
  })

  describe('#data', () => {
    it('should send data to third party client', function (done) {
      this.timeout(15000)

      let data = {
        textMessage : 'This is a test email from SMTP Connector Plugin.',
        htmlMessage : '<h1>This is a test email from SMTP Connector Plugin.</h1> <a href="http://reekoh.com/">Reekoh Website</a>',
        subject : 'Test email'
      }

      _channel.sendToQueue('ip.smtp', new Buffer(JSON.stringify(data)))
      setTimeout(done, 10000)
    })
  })
})
