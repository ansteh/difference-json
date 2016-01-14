'use strict';
const diffrence = require('../../index.js');
const resource = require('../resources.js');

const get = (key) => {
  return {
    value: resource[key].input.value,
    other: resource[key].input.other,
    output: resource[key].output
  }
};

describe("diffrence", function() {
  it("jsonWithStrings", function() {
    let test = get('jsonWithStrings');
    expect(diffrence(test.value, test.other)).toEqual(test.output);
  });

  it("jsonWithStrings", function() {
    let test = get('arrayWithNumbers');
    console.log(diffrence(test.value, test.other));
    expect(diffrence(test.value, test.other)).toEqual(test.output);
  });
});
