const axios = require('axios')
axios.defaults.timeout = 7000

const { slApiKeyTrafficsituation } = require('./api_keys.js')
const { removeLinesFromTrafficSituation } = require('./config.js')

const STATUS_OK = 'ok'
const STATUS_PROBLEM = 'problem'

async function getSlStatus() {
  const response = await axios.get(
    `https://api.sl.se/api2/trafficsituation.json?key=${slApiKeyTrafficsituation}`
  )
  const trafficSituation = getTrafficsituationData(response.data)

  return {
    train: trafficSituation.train,
    subway: trafficSituation.subway,
  }
}

function getTrafficsituationData(apiResponse) {
  const trafficTypesList = apiResponse.ResponseData.TrafficTypes

  const train =
    trafficTypesList
      .find((trafficType) => trafficType.Type === 'train')
      .Events.filter(
        (event) =>
          event.StatusIcon !== 'EventPlanned' &&
          event.StatusIcon !== 'EventGood' &&
          !removeLinesFromTrafficSituation.train.includes(event.TrafficLine)
      ).length > 0

  const subway =
    trafficTypesList
      .find((trafficType) => trafficType.Type === 'metro')
      .Events.filter(
        (event) =>
          event.StatusIcon !== 'EventPlanned' &&
          event.StatusIcon !== 'EventGood' &&
          !removeLinesFromTrafficSituation.metro.includes(event.TrafficLine)
      ).length > 0

  return {
    train: train ? STATUS_PROBLEM : STATUS_OK,
    subway: subway ? STATUS_PROBLEM : STATUS_OK,
  }
}

module.exports = {
  getSlStatus,
  getTrafficsituationData,
  STATUS_OK,
  STATUS_PROBLEM,
}
