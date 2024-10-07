module.exports = {
  keepScriptRunningSec: 5 * 60 - 20,
  secondsBetweenScreens: 20,
  minWalktimeToStopMins: 12, // It takes at least 12 mins to walk to Sundbyberg T-Bana or Pendel
  windowForGoSignalMins: 4, // the window of time where the light turns green.
  slStopId: '9325', // Sundbyberg
  slLinesToShow: [
    {
      designation: '43',
      direction: 'Nynäshamn',
    },
    {
      designation: '43X',
      direction: 'Nynäshamn',
    },
    {
      designation: '10',
      direction: 'Kungsträdgården',
    },
  ],
  weather: {
    long: '17.95943',
    lat: '59.36038',
  },
};
