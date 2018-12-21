const coordinates = require('../src/coordinates');
const expect = require('chai').expect;
const assert = require('chai').assert;

describe ('**coordinates.createCoordinatesBox**', function () {
  const normalLocation = {
    lon: 50,
    lat: 100
  };
  const increment = 5;
  it('should be an array of five', () => {
    const result = coordinates.createCoordinatesBox(normalLocation, increment);
    expect(result).to.be.an('array');
    expect(result.length).to.equal(5);
  })

  it('should match hardcoded results :)', () => {
    const result = coordinates.createCoordinatesBox(normalLocation, increment);
    assert.deepEqual(result[0], [55, 95]);
    assert.deepEqual(result[1], [55, 105]);
    assert.deepEqual(result[2], [45, 105]);
    assert.deepEqual(result[3], [45, 95]);
    assert.deepEqual(result[4], [55, 95]);
  })
})