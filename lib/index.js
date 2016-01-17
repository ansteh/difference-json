'use strict';
const _ = require('lodash');

const simpleDiff = (value, other) => {
  if(value !== other){
    return {
      $set: other,
      $was: value
    };
  }
};

const createDiff = (is, evaluate) => {
  if(_.isUndefined(evaluate)){
    return (value, other) => {
      if(is(value)) return simpleDiff(value, other);
    };
  }
  return (value, other) => {
    if(is(value)) return evaluate(value, other);
  };
};

const assigning = (accu) => {
  return (key, result) => {
    if(result){
      accu[key] = result;
      return true;
    }
    return false;
  };
};

const queue = {
  string: createDiff(_.isString),
  number: createDiff(_.isNumber),
  //array: diffArray
};
const instantEvaluation = (value, other) => {
  let validated;
  _.forEach(queue, (validate) => {
    validated = validate(value, other);
    return _.isUndefined(validated);
  });
  return validated;
};

const stringDiff = createDiff(_.isString);
const numberDiff = createDiff(_.isNumber);

const diffArray = (that, other) => {
  if(_.isArray(that) === false){
    return false;
  }
  return _.reduce(that, function(accu, it, index){
    let dif = diffrence(it, other[index]);
    if(dif){
      accu.push(_.assign(dif, { $index: index}));
    }
    return accu;
  }, []);
};

const diffrence = (obj, other) => {
  //let instant = instantEvaluation(obj, other);
  //console.log(instant);
  //if(instant) return instant;

  if(_.isNumber(obj)){
    let numDif = numberDiff(obj, other);
    if(_.keys(numDif).length > 0){
      return numDif;
    } else {
      return;
    }
  }

  if(_.isArray(obj)){
    return diffArray(obj, other);
  }

  let dif = {};
  let assign = assigning(dif);
  _.forOwn(obj, function(value, key){
    if(_.isString(value)){
      assign(key, stringDiff(value, other[key]));
    } else if(_.isArray(value)){
      assign(key, diffrence(value, other[key]));
    } else if(_.isNumber(value)){
      assign(key, numberDiff(value, other[key]));
    } else {
      assign(key, diffrence(value, other[key]));
    }
  });
  return dif;
};

module.exports = diffrence;
