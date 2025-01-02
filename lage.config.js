module.exports = {
  npmClient: 'yarn',
  pipeline: {
    ['build-tools']: ['^build-tools'],
    build: ['build-tools', '^build'],
    ['ts-emit']: ['build-tools', '^ts-emit'],
    ['ts-check']: ['build-tools', 'ts-emit'],
    ['build-new']: ['ts-emit', 'ts-check'],
    buildci: ['build', 'test', 'depcheck'],
    bundle: ['build-tools', 'build'],
    clean: [],
    depcheck: ['build-tools'],
    lint: ['build-tools'],
    prettier: ['build-tools'],
    ['prettier-fix']: ['build-tools'],
    test: ['build-tools', 'lint', 'build'],
  },
};
