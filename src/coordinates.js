const createCoordinatesBox = (location, increment) => {
  const coordinatesBox = [];
  // Prevent exceeeding poles
  location.lon = location.lon > 90 - increment ? 90 - increment : location.lon;
  location.lon = location.lon < -90 + increment ? -90 + increment : location.lon;
  // Create a box(Polygon) surrounding post's location point
  coordinatesBox.push(
    [
      // top left
      location.lon + increment,
      location.lat - increment < -180
      ? 180 - (increment - (180 - (location.lat * -1)))
      : location.lat - increment
        
    ],
    [
      // top right
      location.lon + increment,
      location.lat + increment > 180 ? increment - (180 - location.lat) : location.lat + increment
    ],
    [
      // bottom right
      location.lon - increment,
      location.lat + increment > 180 ? increment - (180 - location.lat) : location.lat + increment
    ],
    [
      // bottom left
      location.lon - increment,
      location.lat - increment < -180
      ? 180 - (increment - (180 - (location.lat * -1)))
      : location.lat - increment
    ],
    [
      // top left
      location.lon + increment,
      location.lat - increment < -180
      ? 180 - (increment - (180 - (location.lat * -1)))
      : location.lat - increment
    ]
  );
  return coordinatesBox;
};

module.exports = {
  createCoordinatesBox
}