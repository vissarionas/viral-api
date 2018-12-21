const coordinates = require('../src/coordinates');
const expect = require('chai').expect;
const assert = require('chai').assert;

describe ('**createCoordinatesBox**', function () {
  const normalLocation = { lon: 50, lat: 100 };
  const extremeLocation = { lon: 89, lat: 179 };
  const extremeLocationNegative = { lon: -89, lat: -179 };
  const increment = 5;
  it('should be an array of five', () => {
    const result = coordinates.createCoordinatesBox(normalLocation, increment);
    expect(result).to.be.an('array');
    expect(result.length).to.equal(5);
  });

  it('should match hardcoded results', () => {
    const result = coordinates.createCoordinatesBox(normalLocation, increment);
    assert.deepEqual(result[0], [55, 95]);
    assert.deepEqual(result[1], [55, 105]);
    assert.deepEqual(result[2], [45, 105]);
    assert.deepEqual(result[3], [45, 95]);
    assert.deepEqual(result[4], [55, 95]);
  });

  it('should match hardcoded results on extreme locations', () => {
    const result = coordinates.createCoordinatesBox(extremeLocation, increment);
    assert.deepEqual(result[0], [90, 174]);
    assert.deepEqual(result[1], [90, 4]);
    assert.deepEqual(result[2], [80, 4]);
    assert.deepEqual(result[3], [80, 174]);
    assert.deepEqual(result[4], [90, 174]);
  });

  it('should match hardcoded results on extreme negative locations', () => {
    const result = coordinates.createCoordinatesBox(extremeLocationNegative, increment);
    assert.deepEqual(result[0], [-80, 176]);
    assert.deepEqual(result[1], [-80, -174]);
    assert.deepEqual(result[2], [-90, -174]);
    assert.deepEqual(result[3], [-90, 176]);
    assert.deepEqual(result[4], [-80, 176]);
  });
});