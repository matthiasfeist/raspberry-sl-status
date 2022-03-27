const axios = require('axios')
axios.defaults.timeout = 7000

const { slApiKeyTrafficsituation } = require('./api_keys.js')
const { removeLinesFromTrafficSituation } = require('./config.js')

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

  return { train, subway }
}

module.exports = {
  getSlStatus,
  getTrafficsituationData,
}
