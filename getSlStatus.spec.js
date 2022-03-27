const { getTrafficsituationData } = require('./getSlStatus.js')
const fs = require('fs')
const path = require('path')

function loadFixture(name) {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, 'fixtures', name), {
      encoding: 'utf-8',
    })
  )
}

test('filter-green-line-and-pendel-sodertalje.json', () => {
  expect(
    getTrafficsituationData(
      loadFixture('filter-green-line-and-pendel-sodertalje.json')
    )
  ).toStrictEqual({ subway: false, train: false })
})

test('filter-pendel-gnesta-problem.json', () => {
  expect(
    getTrafficsituationData(loadFixture('filter-pendel-gnesta-problem.json'))
  ).toStrictEqual({ subway: false, train: false })
})

test('trafficsituation-balsta-nynashamn-correct.json', () => {
  expect(
    getTrafficsituationData(
      loadFixture('trafficsituation-balsta-nynashamn-correct.json')
    )
  ).toStrictEqual({ subway: false, train: true })
})

test('trafficsituation-problem-balsta-bro.json', () => {
  expect(
    getTrafficsituationData(
      loadFixture('trafficsituation-problem-balsta-bro.json')
    )
  ).toStrictEqual({ subway: false, train: true })
})
