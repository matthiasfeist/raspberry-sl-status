const { Blinkt, COLOURS } = require('blinkt-kit')
const { getSlStatus, STATUS_OK } = require('./getSlStatus.js')
const {
  getWeather,
  STATUS_CLEAR,
  STATUS_CLOUDY,
  STATUS_RAIN,
  STATUS_SNOW,
} = require('./getWeather.js')
const { keepScriptRunningSec } = require('./config.js')

async function main() {
  const blinkt = initBlinkt()
  try {
    const slStatus = await getSlStatus()
    showSlStatus(slStatus, blinkt)
    const weatherStatus = await getWeather()
    showWeatherStatus(weatherStatus, blinkt)
  } catch (err) {
    blinkt.setPixel({ pixel: 0, ...COLOURS.MAGENTA })
    blinkt.show()
    console.log('flashing error pixel')
    console.log(err)
  }
  await delay(keepScriptRunningSec * 1000)
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

function showSlStatus(status, blinkt) {
  const colorSubway =
    status.subway === STATUS_OK
      ? { ...COLOURS.LIME, brightness: 0.2 }
      : { ...COLOURS.RED, brightness: 0.9 }
  blinkt.setPixel({ pixel: 0, ...colorSubway })
  blinkt.setPixel({ pixel: 1, ...colorSubway })
  blinkt.setPixel({ pixel: 2, ...colorSubway })
  blinkt.setPixel({ pixel: 3, ...colorSubway })

  const colorTrain =
    status.train === STATUS_OK
      ? { ...COLOURS.LIME, brightness: 0.2 }
      : { ...COLOURS.RED, brightness: 0.9 }
  blinkt.setPixel({ pixel: 4, ...colorTrain })
  blinkt.setPixel({ pixel: 5, ...colorTrain })
  blinkt.setPixel({ pixel: 6, ...colorTrain })
  blinkt.setPixel({ pixel: 7, ...colorTrain })

  blinkt.show()
}

function showWeatherStatus(status, blinkt) {
  status.forEach((element, index) => {
    let color = COLOURS.MAGENTA
    switch (element) {
      case STATUS_CLEAR:
        color = COLOURS.BLUE
        break
      case STATUS_CLOUDY:
        color = COLOURS.GRAY
        break
      case STATUS_RAIN:
        color = COLOURS.LIGHTBLUE
        break
      case STATUS_SNOW:
        color = COLOURS.WHITE
        break
      default:
        color = COLOURS.MAGENTA
        break
    }
    blinkt.setPixel({ pixel: index, brightness: 0.9, ...color })
    console.log(color)
  })

  blinkt.show()
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
