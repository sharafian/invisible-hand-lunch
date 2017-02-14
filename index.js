#!/usr/bin/env node
'use strict'

const slack = require('slack')
const conf = require('./config.json')
const words = require('./src/message')

const bot = slack.rtm.client()
const token = conf.token
const channel = conf.channel
const time = conf.time
const options = conf.options

let timeStamp = null

const handle = (e, action) => {
  if (e) {
    console.error(action, ':', e)
    process.exit(1)
  }
}

const wait = () => {
  const text = words.random(words.lamentations) +
    ' No responses! It\'s OK---I\'ll wait.'

  slack.chat.postMessage({
    token,
    channel,
    text,
    as_user: true,
    user_name: 'Invisible Hand'
  }, (e, data) => {
    setTimeout(review, time * 60 * 1000)
  })
}

const announce = (reactions) => {
  console.log('announce:', reactions)
  console.log('announce2:', reactions.length)
  const text = 'Looks like the winner is: ' +
    ((reactions.length > 1) ? ('...A tie! Between ') : ('')) +
    (reactions.map((e) => (options[e.name] + ' (:' + e.name + ':)'))).join(' and ') +
    '. ' + words.random(words.celebrations)

  slack.chat.postMessage({
    token,
    channel,
    text,
    as_user: true,
    user_name: 'Invisible Hand'
  }, (e, data) => {
    handle(e, 'finalmessage')
    process.exit(0)
  })
}

const review = () => {
  // get all reactions by initial message's timestamp
  slack.reactions.get({
    token,
    channel: channel,
    timestamp: timeStamp
  }, (e, data) => {
    handle(e, 'reactions')

    // print a message and wait some more if nobody responded
    if (!data.message.reactions) return wait()

    // total up the highest reaction
    let maxCount = 1
    const maxReact = []
    data.message.reactions.forEach((r) => {
      console.log(r.name, ':', r.count)
      if (!options[r.name]) return
      if (r.count > maxCount) {
        maxCount = r.count
        console.log('review:', maxReact)
        maxReact.splice(0, maxReact.length)
      }
      if (r.count === maxCount) maxReact.push(r)
    })

    // announce the result of the vote
    announce(maxReact)
  })
}

const react = (reactions) => {
  if (!reactions.length) {
    return
  }

  slack.reactions.add({
    token,
    channel: channel,
    timestamp: timeStamp,
    name: reactions[0]
  }, (e, data) => {
    handle(e, 'add reaction')
    react(reactions.slice(1))
  })
}

bot.hello(() => {
  console.log('connected!')
  console.log(channel)
  const text = words.random(words.greetings) +
    ' What\'s for lunch today? My suggestions are: ' +
    (Object.keys(options).map((k) => '\n  - ' + ' (:' + k + ':) ' + options[k])) +
    '\nBe good citizens and vote! ' +
    words.random(words.celebrations)

  // print the first greeting
  slack.chat.postMessage({
    token,
    channel,
    text,
    as_user: true,
    user_name: 'Invisible Hand'
  }, (e, data) => {
    handle(e, 'message')
    timeStamp = data.ts
    react(Object.keys(conf.options))
    setTimeout(review, time * 60 * 1000)
  })
})

bot.listen({ token })
