module.exports = {
  arrayWithNumbers: {
    input: {
      value: [1,2,3],
      other: [1,6,7]
    },
    output: [{
      $set: 6,
      $was: 2,
      $index: 1
    }, {
      $set: 7,
      $was: 3,
      $index: 2
    }]
  },
  jsonWithStrings: {
    input: {
      value: {
        name: 'john'
      },
      other: {
        name: 'andre'
      }
    },
    output: {
      name: {
        $was: 'john',
        $set: 'andre'
      }
    }
  },
  githubers: [{
    name: 'john',
    projects: {
      name: 'lodash',
      src: 'git',
      test: [1,2,3]
    }
  }, {
    name: 'phated',
    projects: {
      name: 'gulp',
      src: 'git',
      test: [1,6,7]
    }
  }]
};
