const Utils = require('../src/shared/utils');
const toRadians = angleInDegrees => angleInDegrees * Math.PI / 180;

const toDegrees = angleInRadians => angleInRadians * 180 / Math.PI;

const offset = (c1, distance, bearing) => {
  const lat1 = toRadians(c1[1]);
  const lon1 = toRadians(c1[0]);
  const dByR = distance / 6378137; // distance divided by 6378137 (radius of the earth) wgs84
  const lat = Math.asin(
    Math.sin(lat1) * Math.cos(dByR)
    + Math.cos(lat1) * Math.sin(dByR) * Math.cos(bearing)
  );
  const lon = lon1 + Math.atan2(
    Math.sin(bearing) * Math.sin(dByR) * Math.cos(lat1),
    Math.cos(dByR) - Math.sin(lat1) * Math.sin(lat)
  );
  const longitude = Utils.correctLongitude(toDegrees(lon));
  const latitude = toDegrees(lat);
  return [longitude, latitude];
};

const circleToPolygon = (center, radius, numberOfSegments) => {
  const segments = numberOfSegments || 32;
  const flatCoordinates = [];
  const coordinates = [];
  for (let i = 0; i < segments; i += 1) {
    flatCoordinates.push(...offset(center, radius, 2 * Math.PI * i / segments));
  }
  flatCoordinates.push(flatCoordinates[0], flatCoordinates[1]);

  for (let i = 0, j = 0; j < flatCoordinates.length; j += 2) {
    // eslint-disable-next-line no-plusplus
    coordinates[i++] = flatCoordinates.slice(j, j + 2);
  }

  return {
    type: 'Polygon',
    coordinates: [coordinates.reverse()]
  };
};

module.exports = circleToPolygon;
