const axios = require('axios')
axios.defaults.timeout = 7000

const { slApiKeyTrafficsituation } = require('./api_keys.js')

module.exports = async function () {
  const trafficSituation = await getTrafficsituationData()

  return {
    train: trafficSituation.train,
    subway: trafficSituation.subway,
  }
}

async function getTrafficsituationData() {
  const response = await axios.get(
    `https://api.sl.se/api2/trafficsituation.json?key=${slApiKeyTrafficsituation}`
  )

  let train = false
  let subway = false
  for (const trafficType of response.data.ResponseData.TrafficTypes) {
    if (
      trafficType.Type === 'metro' &&
      trafficType.StatusIcon === 'EventGood'
    ) {
      subway = true
    }

    if (
      trafficType.Type === 'train' &&
      trafficType.StatusIcon === 'EventGood'
    ) {
      train = true
    }
  }

  return { train, subway }
}
