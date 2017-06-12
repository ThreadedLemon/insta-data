
'use strict'

const _ = require('lodash')
const config = require('../config')

const msgDefaults = {
  response_type: 'in_channel',
  username: 'Insta-Data',
  icon_emoji: config('ICON_EMOJI')
}

let attachments = [
  {
    title: 'Insta-Data will help report on user Instagram engagement',
    color: '#2FA44F',
    text: '`/engagement-report` Generates an engagement report against user and Instagram posts within a given channel',
    mrkdwn_in: ['text']
  },
  {
    title: 'Configuring Insta-Data',
    color: '#E3E4E6',
    text: '`/instadata help` ... you\'re lookin at it! \n',
    mrkdwn_in: ['text']
  }
]

const handler = (payload, res) => {
  let msg = _.defaults({
    channel: payload.channel_name,
    attachments: attachments
  }, msgDefaults)

  res.set('content-type', 'application/json')
  res.status(200).json(msg)
  return
}

module.exports = { pattern: /help/ig, handler: handler }
