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
  }),
  describe('getSidesToBeScaled', ()=> {
    it('should equal UP_RIGHT', () => {
      const newLocation = {lon: 17, lat: 48};
      const previousLocation = {lon: 16, lat: 47};
      const result = coordinates.getSidesToBeScaled(newLocation, previousLocation);
      expect(result).to.be.string;
      assert.equal(result, 'UP_RIGHT');
    });
    it('should equal UP_LEFT', () => {
      const newLocation = {lon: 17, lat: 47};
      const previousLocation = {lon: 16, lat: 48};
      const result = coordinates.getSidesToBeScaled(newLocation, previousLocation);
      expect(result).to.be.string;
      assert.equal(result, 'UP_LEFT');
    });
    it('should equal UP_NULL', () => {
      const newLocation = {lon: 17, lat: 48};
      const previousLocation = {lon: 16, lat: 48};
      const result = coordinates.getSidesToBeScaled(newLocation, previousLocation);
      expect(result).to.be.string;
      assert.equal(result, 'UP_NULL');
    });
    it('should equal NULL_NULL', () => {
      const newLocation = {lon: 17, lat: 48};
      const previousLocation = {lon: 17, lat: 48};
      const result = coordinates.getSidesToBeScaled(newLocation, previousLocation);
      expect(result).to.be.string;
      assert.equal(result, 'NULL_NULL');
    });
    it('should equal DOWN_LEFT', () => {
      const newLocation = {lon: 17, lat: 47};
      const previousLocation = {lon: 18, lat: 48};
      const result = coordinates.getSidesToBeScaled(newLocation, previousLocation);
      expect(result).to.be.string;
      assert.equal(result, 'DOWN_LEFT');
    });
    it('should equal DOWN_RIGHT', () => {
      const newLocation = {lon: 16, lat: 48};
      const previousLocation = {lon: 17, lat: 47};
      const result = coordinates.getSidesToBeScaled(newLocation, previousLocation);
      expect(result).to.be.string;
      assert.equal(result, 'DOWN_RIGHT');
    });
    it('should equal DOWN_NULL', () => {
      const newLocation = {lon: 17, lat: 48};
      const previousLocation = {lon: 18, lat: 48};
      const result = coordinates.getSidesToBeScaled(newLocation, previousLocation);
      expect(result).to.be.string;
      assert.equal(result, 'DOWN_NULL');
    });
  }),
  describe('scaleCoordinatesBox', () => {
    it('should scale the coordinates UP_RIGHT', () => {
      const sides = 'UP_RIGHT';
      const existingCoordinateBox = [
        [55, 95],
        [55, 105],
        [45, 105],
        [45, 95],
        [55, 95]
      ];
      const result = coordinates.scaleCoordinatesBox(existingCoordinateBox, sides);
      assert.deepEqual(result, [[60, 95], [60, 110], [45, 110], [45, 95], [60, 95]]);
    });
    it('should scale the coordinates UP_LEFT', () => {
      const sides = 'UP_LEFT';
      const existingCoordinateBox = [
        [55, 95],
        [55, 105],
        [45, 105],
        [45, 95],
        [55, 95]
      ];
      const result = coordinates.scaleCoordinatesBox(existingCoordinateBox, sides);
      assert.deepEqual(result, [[60, 90], [60, 105], [45, 105], [45, 90], [60, 90]]);
    });
    it('should scale the coordinates UP_NULL', () => {
      const sides = 'UP_NULL';
      const existingCoordinateBox = [
        [55, 95],
        [55, 105],
        [45, 105],
        [45, 95],
        [55, 95]
      ];
      const result = coordinates.scaleCoordinatesBox(existingCoordinateBox, sides);
      assert.deepEqual(result, [[60, 95], [60, 105], [45, 105], [45, 95], [60, 95]]);
    });
    it('should scale the coordinates DOWN_RIGHT', () => {
      const sides = 'DOWN_RIGHT';
      const existingCoordinateBox = [
        [55, 95],
        [55, 105],
        [45, 105],
        [45, 95],
        [55, 95]
      ];
      const result = coordinates.scaleCoordinatesBox(existingCoordinateBox, sides);
      assert.deepEqual(result, [[55, 95], [55, 110], [40, 110], [40, 95], [55, 95]]);
    });
    it('should scale the coordinates DOWN_LEFT', () => {
      const sides = 'DOWN_LEFT';
      const existingCoordinateBox = [
        [55, 95],
        [55, 105],
        [45, 105],
        [45, 95],
        [55, 95]
      ];
      const result = coordinates.scaleCoordinatesBox(existingCoordinateBox, sides);
      assert.deepEqual(result, [[55, 90], [55, 105], [40, 105], [40, 90], [55, 90]]);
    });
    it('should scale the coordinates DOWN_NULL', () => {
      const sides = 'DOWN_NULL';
      const existingCoordinateBox = [
        [55, 95],
        [55, 105],
        [45, 105],
        [45, 95],
        [55, 95]
      ];
      const result = coordinates.scaleCoordinatesBox(existingCoordinateBox, sides);
      assert.deepEqual(result, [[55, 95], [55, 105], [40, 105], [40, 95], [55, 95]]);
    });
  });
});