const { Blinkt, COLOURS } = require('blinkt-kit')
const getSlStatus = require('./getSlStatus.js')

const blinkt = new Blinkt()
blinkt.setClearOnExit(true)

// Set LED to a blue-ish color to indicate that it's loading...
blinkt.setPixel({ pixel: 0, ...COLOURS.AQUA })
blinkt.show()

async function main() {
  try {
    const status = await getSlStatus()
    showStatus('left', status.subway)
    showStatus('right', status.train)
  } catch {
    blinkt.flashPixel({
      pixel: 0,
      times: 100,
      intervalms: 100,
      ...COLOURS.ORANGE,
    })
  }
}
main()

function showStatus(side, status) {
  const color = status ? COLOURS.LIME : COLOURS.RED
  blinkt.clear()
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
