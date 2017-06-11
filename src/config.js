
'use strict'

const dotenv = require('dotenv')
const ENV = process.env.NODE_ENV || 'development'

if (ENV === 'development') dotenv.load()

const config = {
  ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  PROXY_URI: process.env.PROXY_URI,
  WEBHOOK_URL: process.env.WEBHOOK_URL,
  SLACK_TOKEN: process.env.SLACK_TOKEN,
  INSTAGRAM_CLIENT_ID: process.env.INSTAGRAM_CLIENT_ID,
  INSTAGRAM_TOKEN: process.env.INSTAGRAM_TOKEN,
  INSTAGRAM_INTEGRATION_USERNAME: process.env.INSTAGRAM_INTEGRATION_USERNAME,
  INSTAGRAM_INTEGRATION_PASSWORD: process.env.INSTAGRAM_INTEGRATION_PASSWORD,
  ICON_EMOJI: ':camera:'
}

module.exports = (key, value) => {
  if (!key) return config

  if (!value) {
    return config[key]
  } else {
    config[key] = value;
  }
}
