# Vanilla SMTP Connector
[![Build Status](https://travis-ci.org/Reekoh/vanilla-smtp-connector.svg)](https://travis-ci.org/Reekoh/vanilla-smtp-connector)
![Dependencies](https://img.shields.io/david/Reekoh/vanilla-smtp-connector.svg)
![Dependencies](https://img.shields.io/david/dev/Reekoh/vanilla-smtp-connector.svg)
![Built With](https://img.shields.io/badge/built%20with-gulp-red.svg)

Vanilla SMTP Connector Plugin for the Reekoh IoT Platform. Integrates a Reekoh instance with a SMTP Server to send emails/notifications.

## Description
This plugin sends emails/notifications based on devices' data connected to the Reekoh Instance via a SMTP Server.

## Configuration
To configure this plugin, a SMTP Email provider account is needed to provide the following:

1. Username - The username to use.
2. Password - The corresponding Password to the username provided.
3. Host - The host name or IP Address of the SMTP provider.

Other Parameters:

1. Default HTML Message - The HTML version of the message to be sent (to be used if the email client supports HTML).
2. Default Text Message - The Text version of the message to be sent (to be used if the email client does not support HTML).
3. Default Sender - The default sender to be used (please note that this email should be added and verified in AWS SES console).
4. Default Receiver -  The default receiver in which the email will be sent.

These parameters are then injected to the plugin from the platform.

## Sample input data
```
{
    sender : 'sender@domain.com',
    receiver : 'receiver@domain.com,receiver2@domain.com',
    message_text : 'This is a test email from SMTP Connector Plugin.',
    message_html : '<h1>This is a test email from SMTP Connector Plugin.</h1> <a href="http://reekoh.com/">Reekoh Website</a>',
    bcc : 'bcc1@domain.com,bcc2@domain.com',
    cc : 'cc1@domain.com,cc2@domain.com',
    subject : 'Test email'
}
```