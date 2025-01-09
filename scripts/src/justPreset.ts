// @ts-check

const { task, series, parallel, condition, option, argv, addResolvePath, prettierCheckTask, prettierTask } = require('just-scripts');

const path = require('path');
const fs = require('fs');

const { clean } = require('./tasks/clean');
const { copy } = require('./tasks/copy');
const { jest } = require('./tasks/jest');
const { ts } = require('./tasks/ts');
const { codegenNativeComponents } = require('./tasks/codegenNativeComponents');
const { eslint } = require('./tasks/eslint');
const { depcheckTask } = require('./tasks/depcheck');
const { checkForModifiedFiles } = require('./tasks/checkForModifiedFilesTask');
const { findGitRoot } = require('workspace-tools');
const { buildCommonJSOnly, buildAll } = require('./utils/buildTs');

export function preset() {
  // this add s a resolve path for the build tooling deps like TS from the scripts folder
  addResolvePath(__dirname);

  option('production');

  // Adds an alias for 'npm-install-mode' for backwards compatibility
  option('min', { alias: 'npm-install-mode' });

  // Build only commonjs (not other TS variants) but still run other tasks
  option('commonjs');

  // for options that have a check/fix switch this puts them into fix mode
  option('fix');

  // run new build style
  option('oldbuild');

  task('clean', clean);
  task('copy', copy);
  task('jest', jest);
  task('codegenNativeComponents', codegenNativeComponents);
  task('ts:commonjs', ts.commonjs);
  task('ts:esm', ts.esm);
  task('ts:all-new', buildAll);
  task('eslint', eslint);
  task('ts:commonjs-only', ts.commonjsOnly);
  task('ts:commonjs-only-new', buildCommonJSOnly);
  task('ts:both', parallel('ts:commonjs', 'ts:esm'));
  task('prettier', () =>
    argv().fix
      ? prettierTask({ files: ['src/.'], ignorePath: path.join(findGitRoot(process.cwd()), '.prettierignore') })
      : prettierCheckTask({ files: ['src/.'], ignorePath: path.join(findGitRoot(process.cwd()), '.prettierignore') }),
  );
  task('checkForModifiedFiles', checkForModifiedFiles);
  task(
    'tsall',
    series(
      condition('ts:both', () => !!argv().oldbuild),
      condition('ts:all-new', () => !argv().oldbuild),
    ),
  );
  task(
    'ts',
    series(
      condition('ts:commonjs-only', () => !!argv().commonjs && !!argv().oldbuild),
      condition('ts:commonjs-only-new', () => !!argv().commonjs && !argv().oldbuild),
      condition('tsall', () => !argv().commonjs),
    ),
  );

  task(
    'validate',
    parallel(
      'eslint',
      condition('jest', () => fs.existsSync(path.join(process.cwd(), 'jest.config.js'))),
    ),
  );

  task(
    'build:node-lib',
    series(
      'clean',
      'copy',
      series(
        condition('validate', () => !argv().min),
        'ts:commonjs-only',
      ),
    ),
  );

  task('build', series('clean', 'copy', 'ts', 'codegenNativeComponents'));

  task('depcheck', depcheckTask);

  task('no-op', () => {});
}
