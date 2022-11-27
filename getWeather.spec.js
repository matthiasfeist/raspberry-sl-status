const {
  processApiData,
  STATUS_CLEAR,
  STATUS_CLOUDY,
  STATUS_RAIN,
  STATUS_SNOW,
} = require('./getWeather.js')
const fs = require('fs')
const path = require('path')

function loadFixture(name) {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, 'fixtures', name), {
      encoding: 'utf-8',
    })
  )
}

test('weather1.json', () => {
  expect(processApiData(loadFixture('weather1.json'))).toStrictEqual([
    'snow',
    'snow',
    'snow',
    'snow',
    'rain',
    'snow',
    'snow',
    'snow',
  ])
})

test('weather2.json', () => {
  expect(processApiData(loadFixture('weather2.json'))).toStrictEqual([
    'cloudy',
    'cloudy',
    'cloudy',
    'cloudy',
    'cloudy',
    'cloudy',
    'cloudy',
    'cloudy',
  ])
})
