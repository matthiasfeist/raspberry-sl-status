const axios = require('axios')
axios.defaults.timeout = 7000

const {
  slApiKeyDeviations,
  slApiKeyTrafficsituation,
} = require('./api_keys.js')

module.exports = async function () {
  const trafficSituation = await getTrafficsituationData()
  const deviationsStatus = await getDeviationsData()

  return {
    train: trafficSituation.train && deviationsStatus.train,
    subway: trafficSituation.subway && deviationsStatus.subway,
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

async function getDeviationsData() {
  const response = await axios.get(
    `https://api.sl.se/api2/deviationsrawdata.json?key=${slApiKeyDeviations}&transportMode=metro,train`
  )

  let train = true
  let subway = true
  for (const deviation of response.data.ResponseData) {
    if (deviation.TransportMode === 'METRO' && deviation.MainNews) {
      subway = false
    }

    if (deviation.TransportMode === 'TRAIN' && deviation.MainNews) {
      train = false
    }
  }

  return { train, subway }
}
