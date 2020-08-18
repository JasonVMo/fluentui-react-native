module.exports = {
  pipeline: {
    build: ['^build'],
    lint: [],
    test: ['build', 'lint'],
    bundle: ['build'],
    buildci: ['test', 'bundle'],
  },
};
