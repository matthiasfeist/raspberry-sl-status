const axios = require('axios')
axios.defaults.timeout = 7000

const { slStopId, slLinesToShow, minWalktimeToStopMins, windowForGoSignalMins } = require('./config.js')

const STATUS_WAIT = 'wait'
const STATUS_GO = 'go'
const STATUS_PROBLEM = 'problem'

async function getSlDepartureInformation() {
  console.log('loading SL departure information...');
  console.time('SL departure information loaded.');
  const response = await axios.get(
    `https://transport.integration.sl.se/v1/sites/${slStopId}/departures?forecast=30`
  )
  const departures = response.data.departures;
  if (!departures || !Array.isArray(departures)) throw Error('SL departures error');

  console.timeEnd('SL departure information loaded.');
  return departures;
}

function parseSlDepartureInformation(departures) {
  const filteredDep = departures
    // filter out all lines we don't need:
    .filter(departure => {
      const direction = departure.direction;
      const designation = departure.line.designation;
      return !!slLinesToShow.find(conf => conf.designation == designation && conf.direction == direction)
    })
    // filter out all statuses where the trains are cancelled or have a problem
    .filter(departure => {
      return departure.state !== 'CANCELLED'
        && ['NORMALPROGRESS', 'FASTPROGRESS', 'EXPECTED', 'SLOWPROGRESS'].includes(departure.journey.state)
    })
    // filter out all departures that we can't reach anymore
    .filter(departure => minsBetween(departure.expected) > minWalktimeToStopMins)
    // map all the attributes we need and add a go/not-yet property
    .map(departure => {
      return {
        goNow: minsBetween(departure.expected) < (minWalktimeToStopMins + windowForGoSignalMins),
        designation: departure.line.designation,
        mode: departure.line.transport_mode,
        display: departure.display,
        mins: minsBetween(departure.expected)
      }
    })

  console.table(filteredDep);

  let metro = STATUS_PROBLEM;
  if (filteredDep.some(dep => dep.mode === 'METRO')) {
    metro = filteredDep.some(dep => dep.goNow === true && dep.mode === 'METRO') ? STATUS_GO : STATUS_WAIT;
  }

  let train = STATUS_PROBLEM;
  if (filteredDep.some(dep => dep.mode === 'TRAIN')) {
    train = filteredDep.some(dep => dep.goNow === true && dep.mode === 'TRAIN') ? STATUS_GO : STATUS_WAIT;
  }

  return {
    metro, train
  }
}


function minsBetween(date) {
  return Math.floor((new Date(date).valueOf() - new Date().valueOf()) / 1000 / 60);
}

module.exports = {
  getSlDepartureInformation,
  parseSlDepartureInformation,
  STATUS_GO,
  STATUS_WAIT,
  STATUS_PROBLEM,
}
