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

const getSidesToBeScaled = (newLocation, previousLocation) => {
  const sides = [];
  if (newLocation.lon > previousLocation.lon) {
    sides.push('UP');
    if (newLocation.lat > previousLocation.lat) {
      sides.push('RIGHT');
    } else if (newLocation.lat < previousLocation.lat) {
      sides.push('LEFT');
    } else {
      sides.push('NULL');
    }
  } else if (newLocation.lon < previousLocation.lon) {
    sides.push('DOWN');
    if (newLocation.lat > previousLocation.lat) {
      sides.push('RIGHT');
    } else if (newLocation.lat < previousLocation.lat) {
      sides.push('LEFT');
    } else {
      sides.push('NULL');
    }
  } else {
    sides.push('NULL');
    if (newLocation.lat > previousLocation.lat) {
      sides.push('RIGHT');
    } else if (newLocation.lat < previousLocation.lat) {
      sides.push('LEFT');
    } else {
      sides.push('NULL');
    }
  }
  return sides.join('_');
};

const scaleCoordinatesBox = (existingCoordinatesBox, sides) => {
  switch (sides) {
    case 'UP_RIGHT':
      existingCoordinatesBox[0][0] += 5;
      existingCoordinatesBox[1][0] += 5;
      existingCoordinatesBox[1][1] += 5;
      existingCoordinatesBox[2][1] += 5;
      existingCoordinatesBox[4][0] += 5;
      break;
    case 'UP_LEFT':
      existingCoordinatesBox[0][0] += 5;
      existingCoordinatesBox[0][1] -= 5;
      existingCoordinatesBox[1][0] += 5;
      existingCoordinatesBox[3][1] -= 5;
      existingCoordinatesBox[4][0] += 5;
      existingCoordinatesBox[4][1] -= 5;
      break;
    case 'UP_NULL':
      existingCoordinatesBox[0][0] += 5;
      existingCoordinatesBox[1][0] += 5;
      existingCoordinatesBox[4][0] += 5;
      break;
    case 'DOWN_RIGHT':
      existingCoordinatesBox[1][1] += 5;
      existingCoordinatesBox[2][0] -= 5;
      existingCoordinatesBox[2][1] += 5;
      existingCoordinatesBox[3][0] -= 5;
      break;
    case 'DOWN_LEFT':
      existingCoordinatesBox[0][1] -= 5;
      existingCoordinatesBox[2][0] -= 5;
      existingCoordinatesBox[3][0] -= 5;
      existingCoordinatesBox[3][1] -= 5;
      existingCoordinatesBox[4][1] -= 5;
      break;
    case 'DOWN_NULL':
      existingCoordinatesBox[2][0] -= 5;
      existingCoordinatesBox[3][0] -= 5;
      break;
    case 'NULL_NULL':
      return existingCoordinatesBox;
    default:
      return existingCoordinatesBox;
  }
  return existingCoordinatesBox;
};

module.exports = {
  createCoordinatesBox,
  getSidesToBeScaled,
  scaleCoordinatesBox
};
