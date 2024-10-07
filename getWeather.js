const axios = require('axios');
axios.defaults.timeout = 7000;

const { weather } = require('./config.js');

const STATUS_CLEAR = 'clear';
const STATUS_CLOUDY = 'cloudy';
const STATUS_RAIN = 'rain';
const STATUS_SNOW = 'snow';
const STATUS_UNKNOWN = 'unknown';

async function getWeather() {
  console.log('loading SMHI forecast...');
  console.time('SMHI forecast loaded.');
  const response = await axios.get(
    `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${weather.long}/lat/${weather.lat}/data.json`
  );
  console.timeEnd('SMHI forecast loaded.');
  return processApiData(response.data);
}

function processApiData(data) {
  const result = [];
  const timeSeries = data.timeSeries;

  if (timeSeries.length > 7) {
    for (let index = 0; index <= 7; index++) {
      const wsymb = parseInt(
        getValueFromTimeseriesParam(timeSeries[index].parameters, 'Wsymb2')
      );
      switch (wsymb) {
        case 1:
        case 2:
        case 3:
          result.push(STATUS_CLEAR);
          break;
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
          result.push(STATUS_CLOUDY);
          break;
        case 9:
        case 10:
        case 11:
        case 18:
        case 19:
        case 20:
        case 21:
          result.push(STATUS_RAIN);
          break;
        case 12:
        case 13:
        case 14:
        case 15:
        case 16:
        case 17:
        case 22:
        case 23:
        case 24:
        case 25:
        case 26:
        case 27:
          result.push(STATUS_SNOW);
          break;
        default:
          result.push(STATUS_UNKNOWN);
          break;
      }
    }
  }
  return result;
}

function getValueFromTimeseriesParam(timeseriesParams, name) {
  const param = timeseriesParams.find((elem) => elem.name === name);
  return param.values[0] || null;
}

module.exports = {
  getWeather,
  processApiData,
  STATUS_CLEAR,
  STATUS_CLOUDY,
  STATUS_RAIN,
  STATUS_SNOW,
  STATUS_UNKNOWN,
};
