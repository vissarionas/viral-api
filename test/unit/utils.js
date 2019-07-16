const { expect } = require('chai');
const Utils = require('../../src/shared/utils');

describe('Utils - CorrectLongitude', () => {
  it('corrects longitude if exceeds 180', () => {
    expect(Utils.correctLongitude(181.5)).to.be.equal(-178.5);
  });
  it('corrects longitude if exceeds -180', () => {
    expect(Utils.correctLongitude(-181.5)).to.be.equal(178.5);
  });
});
