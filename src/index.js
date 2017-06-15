/**
 * Simple Express server for handling Slack / commands 
 * 
 * @author    Slade Solobay
 * @date      2017-06-10 
 */
'use strict'

const express = require('express');
const proxy = require('express-http-proxy');
const bodyParser = require('body-parser');
const _ = require('lodash');
const config = require('./config');
const commands = require('./commands');
const helpCommand = require('./commands/help');
const slackCallouts = require('./slack-callouts');
const instagramCallouts = require('./instagram-callouts');

let bot = require('./bot');

let app = express();

if (config('PROXY_URI')) {
  app.use(proxy(config('PROXY_URI'), {
    forwardPath: (req, res) => { return require('url').parse(req.url).path }
  }))
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => { res.send('\n 👋 🌍 \n') })

app.post('/commands/help', (req, res) => {
  let payload = req.body;

  console.log(payload);
  
  if (!payload || payload.token !== config('SLACK_VERIFICATION_TOKEN')) {
    let err = '✋  Insta—what? An incorrect Slack verification token was provided\n' +
              '   Is your Slack token correctly configured?';
    console.log(err);
    res.status(401).end(err);
    return;
  }

  let cmd = _.reduce(commands, (a, cmd) => {
    return payload.text.match(cmd.pattern) ? cmd : a
  }, helpCommand);

  cmd.handler(payload, res);
});

app.post('/commands/engagement', (req, res) => {
  let payload = req.body;
  
  // if (!payload || payload.token !== config('SLACK_VERIFICATION_TOKEN')) {
  //   let err = '✋  Insta—what? An incorrect Slack verification token was provided\n' +
  //             '   Is your Slack token correctly configured?';
  //   console.log(err);
  //   res.status(401).end(err);
  //   return;
  // }
  

  //slackCallouts.message('Generating report...', payload.channel_id);
  slackCallouts.getHistory(payload.channel_id);

  res.sendStatus(200);
  return;
});

app.listen(config('PORT'), (err) => {
  if (err) throw err

  instagramCallouts.generateAccessToken();
  console.log(`\n📷  Insta-Data LIVES on PORT ${config('PORT')} 📷`);
});
