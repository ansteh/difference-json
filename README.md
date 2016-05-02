[![Build Status](https://api.travis-ci.org/ansteh/difference-json.svg?branch=master)](https://travis-ci.org/ansteh/difference-json)


## Install

Using npm:

```js
npm install difference-json
```

## Usage

Get the difference of arrays:
```js
var diff = require('difference-json');
var result = diff([1,2,3],[1,6,7]);
//result equals:
[{
  $set: 6,
  $was: 2,
  $index: 1
}, {
  $set: 7,
  $was: 3,
  $index: 2
}]
```

Get the difference of simple json objects:
```js
var diff = require('difference-json');
var result = diff({
  name: 'john'
},{
  name: 'andre'
});
//result equals:
{
  name: {
    $was: 'john',
    $set: 'andre'
  }
}
```

Get the difference of simple nested json objects:
```js
var diff = require('difference-json');
var result = diff({
  role: 'customer',
  basket: {
    sum: 20
  }
},{
  role: 'customer',
  basket: {
    sum: 35
  }
});
//result equals:
{
  basket: {
    sum: {
      $set: 35,
      $was: 20
    }
  }
}
```

## Related

- [shape-json](https://github.com/ansteh/shape-json) - Convert json to json with a predefined scheme
- [shape-array](https://github.com/ansteh/shape-array) - Convert array to json object

## License

MIT © [Andre Stehle](https://github.com/ansteh)
