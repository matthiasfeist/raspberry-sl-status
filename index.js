const { Blinkt, COLOURS } = require('blinkt-kit');

const blinkt = new Blinkt();
blinkt.setAll({ r: 128, g: 0, b: 128, brightness: 0.2 });
blinkt.show();
