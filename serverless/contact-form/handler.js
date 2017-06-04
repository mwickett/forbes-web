'use strict';

const AWS = require('aws-sdk')
const ses = new AWS.SES()

const RECEIVER = [ 'mike@sagecomm.com', 'mike@wickett.ca', 'mike@drforbes.ca' ]
const SENDER = 'mike@drforbes.ca'

module.exports.formEmail = function (event, context) {
  console.log('Received event:', event)
  sendEmail(event, function (err, data) {
    context.done(err, null)
  })
}

function sendEmail (event, done) {
  const params = {
    Destination: {
      ToAddresses: RECEIVER
    },
    Message: {
      Body: {
        Text: {
          Data: 'Name: ' + event.name + '\nEmail: ' + event.email + '\nDesc: ' + event.description,
          Charset: 'UTF-8'
        }
      },
      Subject: {
        Data: 'Dr. Forbes & Associates Web Contact Form: ' + event.name,
        Charset: 'UTF-8'
      }
    },
    Source: SENDER
  }
  ses.sendEmail(params, done)
}
