'use strict';
const _ = require('lodash');

const stringDiff = (str, other) => {
  if(str !== other){
    return {
      $set: other,
      $was: str
    };
  }
};

const numberDiffrence = (number, other) => {
  if(number !== other){
    return {
      $set: other,
      $was: number
    };
  }
};

const diffArray = (that, other) => {
  return _.reduce(that, function(accu, it, index){
    let dif = diffrence(it, other[index]);
    if(dif){
      accu.push(_.assign(dif, { $index: index}));
    }
    return accu;
  }, []);
};

const diffrence = (obj, other) => {
  if(_.isNumber(obj)){
    let numDif = numberDiffrence(obj, other);
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
  _.forOwn(obj, function(value, key){
    if(_.isString(value)){
      let strDif = stringDiff(value, other[key]);
      if(strDif) dif[key] = strDif;
    } else if(_.isArray(value)){
      let deepDif = diffArray(value, other[key]);
      if(deepDif) dif[key] = deepDif;
    } else if(_.isNumber(value)){
      let numberDif = numberDiffrence(value, other[key]);
      if(numberDif) dif[key] = numberDif;
    } else {
      let deepDif = diffrence(value, other[key]);
      if(deepDif) dif[key] = deepDif;
    }
  });
  return dif;
};

module.exports = diffrence;
