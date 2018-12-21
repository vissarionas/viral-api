const createCoordinatesBox = (longitude, latitude, increment) => {
  const coordinatesBox = [];
  // Prevent exceeeding poles
  longitude = longitude > 90 - increment ? 90 - increment : longitude;
  longitude = longitude < -90 + increment ? -90 + increment : longitude;
  // Create a box(Polygon) surrounding post's location point
  coordinatesBox.push(
    [
      // top left
      longitude + increment,
      latitude - increment < -180
      ? 180 - (increment - (180 - (latitude * -1)))
      : latitude - increment
        
    ],
    [
      // top right
      longitude + increment,
      latitude + increment > 180 ? increment - (180 - latitude) : latitude + increment
    ],
    [
      // bottom right
      longitude - increment,
      latitude + increment > 180 ? increment - (180 - latitude) : latitude + increment
    ],
    [
      // bottom left
      longitude - increment,
      latitude - increment < -180
      ? 180 - (increment - (180 - (latitude * -1)))
      : latitude - increment
    ],
    [
      // top left
      longitude + increment,
      latitude - increment < -180
      ? 180 - (increment - (180 - (latitude * -1)))
      : latitude - increment
    ]
  );
  return coordinatesBox;
};

module.exports = {
  createCoordinatesBox
}