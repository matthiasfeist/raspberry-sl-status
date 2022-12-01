const { Blinkt, COLOURS } = require('blinkt-kit')
const { getSlStatus, STATUS_OK } = require('./getSlStatus.js')
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
    const slStatus = await getSlStatus()
    const weatherStatus = await getWeather()

    let screen = 0
    setInterval(() => {
      screen += 1
      if (screen % 2 === 0) {
        showSlStatus(slStatus, blinkt)
      } else {
        showWeatherStatus(weatherStatus, blinkt)
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
  // reverse the array to show it the right way on the PI
  status.reverse().forEach((element, index) => {
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
