const coordinates = require('../src/coordinates');
const expect = require('chai').expect;
const assert = require('chai').assert;

describe('coordinates', () => {
  describe ('createCoordinatesBox', () => {
    it('should be an array of five', () => {
      const result = coordinates.createCoordinatesBox(50 , 100, 5);
      expect(result).to.be.an('array');
      expect(result.length).to.equal(5);
    });
  
    it('should match hardcoded results', () => {
      const result = coordinates.createCoordinatesBox(50, 100, 5);
      assert.deepEqual(result[0], [55, 95]);
      assert.deepEqual(result[1], [55, 105]);
      assert.deepEqual(result[2], [45, 105]);
      assert.deepEqual(result[3], [45, 95]);
      assert.deepEqual(result[4], [55, 95]);
    });
  
    it('should match negative hardcoded results', () => {
      const result = coordinates.createCoordinatesBox(-50, -100, 5);
      assert.deepEqual(result[0], [-45, -105]);
      assert.deepEqual(result[1], [-45, -95]);
      assert.deepEqual(result[2], [-55, -95]);
      assert.deepEqual(result[3], [-55, -105]);
      assert.deepEqual(result[4], [-45, -105]);
    });
  
    it('should match hardcoded results on extreme locations', () => {
      const result = coordinates.createCoordinatesBox(89, 179, 5);
      assert.deepEqual(result[0], [90, 174]);
      assert.deepEqual(result[1], [90, 4]);
      assert.deepEqual(result[2], [80, 4]);
      assert.deepEqual(result[3], [80, 174]);
      assert.deepEqual(result[4], [90, 174]);
    });
  
    it('should match hardcoded results on extreme negative locations', () => {
      const result = coordinates.createCoordinatesBox(-89, -179, 5);
      assert.deepEqual(result[0], [-80, 176]);
      assert.deepEqual(result[1], [-80, -174]);
      assert.deepEqual(result[2], [-90, -174]);
      assert.deepEqual(result[3], [-90, 176]);
      assert.deepEqual(result[4], [-80, 176]);
    });
  
    it('should match hardcoded results on mixPositiveNegative locations', () => {
      const result = coordinates.createCoordinatesBox(2, -179, 5);
      assert.deepEqual(result[0], [7, 176]);
      assert.deepEqual(result[1], [7, -174]);
      assert.deepEqual(result[2], [-3, -174]);
      assert.deepEqual(result[3], [-3, 176]);
      assert.deepEqual(result[4], [7, 176]);
    });
  
    it('should match hardcoded results on mixNegativePositive locations', () => {
      const result = coordinates.createCoordinatesBox(-2, 179, 5);
      assert.deepEqual(result[0], [3, 174]);
      assert.deepEqual(result[1], [3, 4]);
      assert.deepEqual(result[2], [-7, 4]);
      assert.deepEqual(result[3], [-7, 174]);
      assert.deepEqual(result[4], [3, 174]);
    });  
  });
});