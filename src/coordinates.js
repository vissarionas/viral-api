const createCoordinatesBox = (location, increment) => {
  const coordinatesBox = [];
  // Prevent exceeeding poles
  location.lon = location.lon > 90 - increment ? 90 - increment : location.lon;
  location.lon = location.lon < -90 + increment ? -90 + increment : location.lon;

  coordinatesBox.push(
    [
      // TOP LEFT
      location.lon + increment,
      location.lat - increment
    ],
    [
      // TOP RIGHT
      location.lon + increment,
      location.lat + increment
    ],
    [
      // BOTTOM RIGHT
      location.lon - increment,
      location.lat + increment 
    ],
    [
      // BOTTOM LEFT
      location.lon - increment,
      location.lat - increment
    ],
    [
      // TOP LEFT
      location.lon + increment,
      location.lat - increment
    ]
  );
  return coordinatesBox;
};

module.exports = {
  createCoordinatesBox
}