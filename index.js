const { Blinkt, COLOURS } = require('blinkt-kit')
const { getSlStatus, STATUS_OK } = require('./getSlStatus.js')
const { keepScriptRunningSec } = require('./config.js')

const blinkt = new Blinkt()
blinkt.setClearOnExit(true)

// Set LED to a blue-ish color to indicate that it's loading...
blinkt.clear()
blinkt.setPixel({ pixel: 0, ...COLOURS.AQUA })
blinkt.show()

async function main() {
  try {
    const status = await getSlStatus()
    showStatus('left', status.subway)
    showStatus('right', status.train)
  } catch (err) {
    blinkt.setPixel({ pixel: 0, ...COLOURS.MAGENTA })
    blinkt.show()
    console.log('flashing error pixel')
    console.log(err)
  }
  await delay(keepScriptRunningSec * 1000)
}
main()

function showStatus(side, status) {
  const color =
    status === STATUS_OK
      ? { ...COLOURS.LIME, brightness: 0.2 }
      : { ...COLOURS.RED, brightness: 0.9 }
  if (side === 'left') {
    console.log('left', color)
    blinkt.setPixel({ pixel: 0, ...color })
    blinkt.setPixel({ pixel: 1, ...color })
    blinkt.setPixel({ pixel: 2, ...color })
    blinkt.setPixel({ pixel: 3, ...color })
  } else {
    console.log('right', color)

    blinkt.setPixel({ pixel: 4, ...color })
    blinkt.setPixel({ pixel: 5, ...color })
    blinkt.setPixel({ pixel: 6, ...color })
    blinkt.setPixel({ pixel: 7, ...color })
  }
  blinkt.show()
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
