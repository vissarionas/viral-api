const Utils = {};

Utils.stringToBoolean = value => (value === 'true');

Utils.correctLongitude = (longitude) => {
  if (longitude > 180) {
    return (180 - (longitude - 180)) * -1;
  }
  if (longitude < -180) {
    return 180 - ((longitude * -1) - 180);
  }
  return longitude;
};

module.exports = Utils;
