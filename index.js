const { Blinkt, COLOURS } = require('blinkt-kit')
const {
  getSlDepartureInformation,
  parseSlDepartureInformation,
  STATUS_GO,
  STATUS_WAIT,
  STATUS_PROBLEM,
} = require('./getSlDepartureInformation.js')
const {
  getWeather,
  STATUS_CLEAR,
  STATUS_CLOUDY,
  STATUS_RAIN,
  STATUS_SNOW,
} = require('./getWeather.js')
const { keepScriptRunningSec, secondsBetweenScreens } = require('./config.js')

async function main() {
  setTimeout(() => {
    process.exit()
  }, keepScriptRunningSec * 1000)

  const blinkt = initBlinkt()
  try {
    const slDepartureData = await getSlDepartureInformation()

    // reverse the array to show it the right way on the PI
    const weatherStatus = (await getWeather()).reverse()

    let screen = 0
    setInterval(() => {
      screen += 1
      if (screen % 2 === 0) {
        showWeatherStatus(weatherStatus, blinkt)
      } else {
        showSlDeparture(parseSlDepartureInformation(slDepartureData), blinkt)
      }
    }, secondsBetweenScreens * 1000)
  } catch (err) {
    blinkt.setPixel({ pixel: 0, ...COLOURS.MAGENTA })
    blinkt.show()
    console.log('flashing error pixel')
    console.log(err)
  }
}
main()

function initBlinkt() {
  const blinkt = new Blinkt()
  blinkt.setClearOnExit(true)

  // Set LED to a blue-ish color to indicate that it's loading...
  blinkt.clear()
  blinkt.setPixel({ pixel: 0, ...COLOURS.AQUA })
  blinkt.show()
  return blinkt
}

function showSlDeparture(departures, blinkt) {
  const colorTrain = getSlStatusColor(departures.train)
  blinkt.setPixel({ pixel: 0, ...colorTrain })
  blinkt.setPixel({ pixel: 1, ...colorTrain })
  blinkt.setPixel({ pixel: 2, ...colorTrain })
  blinkt.setPixel({ pixel: 3, ...colorTrain })

  const colorMetro = getSlStatusColor(departures.metro)
  blinkt.setPixel({ pixel: 4, ...colorMetro })
  blinkt.setPixel({ pixel: 5, ...colorMetro })
  blinkt.setPixel({ pixel: 6, ...colorMetro })
  blinkt.setPixel({ pixel: 7, ...colorMetro })

  blinkt.show()
}

function getSlStatusColor(status) {
  switch (status) {
    case STATUS_GO:
      return { ...COLOURS.LIME, brightness: 0.2 }
    case STATUS_WAIT:
      return { r: 255, g: 90, b: 0, brightness: 0.5 }
    case STATUS_PROBLEM:
      return { ...COLOURS.RED, brightness: 0.9 }
    default:
      return COLOURS.MAGENTA
  }
}

function showWeatherStatus(status, blinkt) {
  status.forEach((element, index) => {
    let color = COLOURS.MAGENTA
    switch (element) {
      case STATUS_CLEAR:
      case STATUS_CLOUDY:
        color = { brightness: 0.3, r: 255, g: 255, b: 150 } // warm white
        break
      case STATUS_RAIN:
      case STATUS_SNOW:
        color = { brightness: 1, ...COLOURS.BLUE }
        break
      default:
        color = COLOURS.MAGENTA
        break
    }
    blinkt.setPixel({ pixel: index, ...color })
  })

  blinkt.show()
}
