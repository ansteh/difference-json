'use strict';
const _ = require('lodash');

const hasKeys = (obj) => {
  return _.keys(obj).length > 0
};

const simpleDiff = (value, other) => {
  if(_.isUndefined(value)) {
    return {
      $set: other
    }
  }

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
      if(is(value)) {
        return simpleDiff(value, other);
      } else {
        return simpleDiff(undefined, other);
      }
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

const stringDiff = createDiff(_.isString);
const numberDiff = createDiff(_.isNumber);
const booleanDiff = createDiff(_.isBoolean);

const diffArray = (that, other) => {
  if(that.length < other.length) {
    let length = other.length - that.length;
    let fillers = _.times(length, _.constant({}));
    that = _.concat(that, fillers);
  }

  return _.reduce(that, function(accu, it, index){
    let dif = diffrence(it, other[index]);
    if(hasKeys(dif)){
      accu.push(_.assign(dif, { $index: index }));
    }
    return accu;
  }, []);
};

const getAddedProperties = (obj, other) => {
  return _.difference(_.keys(other), _.keys(obj));
};

const diffrence = (obj, other) => {
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
    } else if(_.isBoolean(value)) {
      assign(key, booleanDiff(value, other[key]));
    } else {
      assign(key, diffrence(value, other[key]));
    }
  });

  let addedProperties = _.pick(other, getAddedProperties(obj, other));
  _.forOwn(addedProperties, (value, key) => {
    if(_.isString(value)){
      assign(key, stringDiff(undefined, value));
    } else if(_.isArray(value)){
      assign(key, diffrence(undefined, value));
    } else if(_.isNumber(value)){
      assign(key, numberDiff(undefined, value));
    } else if(_.isBoolean(value)) {
      assign(key, booleanDiff(undefined, value));
    } else {
      assign(key, diffrence(undefined, other[key]));
    }
  });

  return dif;
};

module.exports = diffrence;
