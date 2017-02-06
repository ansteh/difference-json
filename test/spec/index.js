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

  it("arrayWithNumbers", function() {
    let test = get('arrayWithNumbers');
    expect(diffrence(test.value, test.other)).toEqual(test.output);
  });

  it("customer basket", function() {
    let test = get('customer');
    expect(diffrence(test.value, test.other)).toEqual(test.output);
  });

  it("boolean property difference", function() {
    let test = get('customer');
    expect(diffrence({
      prop: true
    }, {
      prop: false
    })).toEqual({
      prop: {
        $was: true,
        $set: false
      }
    });
  });

  it("boolean property difference empty", function() {
    let test = get('customer');
    expect(diffrence({
      prop: true
    }, {
      prop: true
    })).toEqual({});
  });

  // diff([{prop: 1}], [{prop: 1}, {prop: 2}]);
  // is it possible to detect prop2?

  it("deep property difference", function() {
    expect(diffrence([{prop: 1}], [{prop: 1}, {prop: 2}]))
    .toEqual([{
      prop: {
        $set: 2
      },
      $index: 1
    }]);
  });
});
