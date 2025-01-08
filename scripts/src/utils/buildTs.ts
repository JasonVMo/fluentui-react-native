import ts from 'typescript';

import { buildTypescript } from '../tools-typescript';

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
