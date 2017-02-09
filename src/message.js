const Conf = require('../config.json')
const random = (list) => list[ (Math.random() * list.length) | 0 ]

const greetings = [
  'Huzzah!',
  'Quite good!',
  'Indubitable!',
  'Tally ho!',
  'Wunderbah!',
  'Jolly good!',
  'I say!',
  'Lo!'
]

const celebrations = [
  'That\'s capitalism!',
  'Market forces at work!',
  'Take that, communism!',
  'Most indubitably!',
  'Rather quite!',
  'I do rather say!',
  'Wonderful!',
  'A good show, I say!',
  'All good in the \'hood!'
]

const lamentations = [
  'Oh no!',
  'Oh dear!',
  'Oy vey!',
  'Aye!',
  'Good heavens!',
  'Mon dieu!',
  'Sacre bleu!',
  'A shame, a shame!',
  'A shame!',
  'Forgive me!',
  'Most disgraceful!',
  'What a disgrace!',
  'Inconceivable!',
  'Que lastima!' 
]  

const luck = [
  'Good luck!',
  'Best of luck!',
  'Take... luck!',
  'Do take care now!',
  'May the force be with you, always.',
  'Long live Interledger!',
  'Give \'em hell!',
  'Energy to Evan Schwartz!'
]

module.exports = {
  random,
  celebrations,
  luck,
  lamentations,
  greetings
}
