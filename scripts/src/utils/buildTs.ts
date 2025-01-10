import { TaskFunction } from 'just-task';
import ts from 'typescript';

import { buildTypescript } from '../tools-typescript';
import { buildTypescriptAsync } from '../tools-typescript/buildTypescript';

export function buildAll() {
  buildTypescript({
    srcDir: 'src',
    outputs: [
      {
        libDir: 'lib',
        module: ts.ModuleKind.ESNext,
      },
      {
        libDir: 'lib-commonjs',
        module: ts.ModuleKind.CommonJS,
      },
    ],
  });
}

export function buildAllAsync(): TaskFunction {
  return async function asyncBuild(done: () => void) {
    return Promise.resolve(
      buildTypescriptAsync({
        srcDir: 'src',
        outputs: [
          {
            libDir: 'lib',
            module: ts.ModuleKind.ESNext,
          },
          {
            libDir: 'lib-commonjs',
            module: ts.ModuleKind.CommonJS,
          },
        ],
      }),
    ).then(() => {
      if (done) {
        done();
      }
    });
  };
}

export function buildCommonJSOnly() {
  buildTypescript({
    srcDir: 'src',
    outputs: [
      {
        libDir: 'lib',
        module: ts.ModuleKind.CommonJS,
      },
    ],
  });
}

export function checkTypes() {
  buildTypescript({
    srcDir: 'src',
  });
}
