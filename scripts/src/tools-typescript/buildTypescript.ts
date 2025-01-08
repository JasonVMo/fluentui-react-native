import { findConfigFile, readConfigFile } from '@rnx-kit/typescript-service';
import ts from 'typescript';

import { BuildTask, BuildTaskOptions, createBuildTask } from './createBuildTask';
import { BuildTypescriptOptions } from './types';

const defaultOptions: ts.CompilerOptions = {
  pretty: true,
  target: ts.ScriptTarget.ES5,
};

const stringToTarget = {
  es3: ts.ScriptTarget.ES3,
  es5: ts.ScriptTarget.ES5,
  es6: ts.ScriptTarget.ES2015,
  es2016: ts.ScriptTarget.ES2016,
  es2017: ts.ScriptTarget.ES2017,
  es2018: ts.ScriptTarget.ES2018,
  es2019: ts.ScriptTarget.ES2019,
  es2020: ts.ScriptTarget.ES2020,
  es2021: ts.ScriptTarget.ES2021,
  es2022: ts.ScriptTarget.ES2022,
  esnext: ts.ScriptTarget.ESNext,
};

const stringToModule = {
  commonjs: ts.ModuleKind.CommonJS,
  amd: ts.ModuleKind.AMD,
  esnext: ts.ModuleKind.ESNext,
};

function sanitizeOptions(userOptions: ts.CompilerOptions): ts.CompilerOptions {
  const options = { ...userOptions };
  if (typeof options.module === 'string') {
    options.module = stringToModule[(options.module as string).toLowerCase()] || ts.ModuleKind.CommonJS;
  }
  if (options.target && typeof options.target === 'string') {
    options.target = stringToTarget[(options.target as string).toLowerCase()] || ts.ScriptTarget.ES5;
  }
  return options;
}

function getBaseConfig(cwd: string, extraOptions?: ts.CompilerOptions): ts.ParsedCommandLine {
  // now try to find the tsconfig.json file and parse that
  const configFileName = findConfigFile(cwd);
  if (!configFileName) {
    throw new Error('Could not find a valid tsconfig.json.');
  }
  const parsedCmdLine = readConfigFile(configFileName);
  if (!parsedCmdLine) {
    throw new Error('Could not read tsconfig.json.');
  }
  return extraOptions ? { ...parsedCmdLine, options: { ...defaultOptions, ...parsedCmdLine.options, ...extraOptions } } : parsedCmdLine;
}

export function buildTypescript({ srcDir = 'src', outputs, compilerOptions }: BuildTypescriptOptions) {
  const pkgRoot = process.cwd();
  const cmdLine = getBaseConfig(pkgRoot, { ...defaultOptions, ...sanitizeOptions(compilerOptions) });
  const tasks: { name: string; exec: BuildTask }[] = [];
  const baseTaskOptions: BuildTaskOptions = {
    pkgRoot,
    srcDir,
    cmdLine,
    module: ts.ModuleKind.CommonJS,
  };

  if (outputs && outputs.length > 0) {
    const emitOnlyOutputs = cmdLine.options.isolatedModules && outputs.length > 1;
    // always build the first listed output
    const buildOutputs = emitOnlyOutputs ? [outputs[0]] : outputs;
    const emitOutputs = emitOnlyOutputs ? outputs.slice(1) : [];
    const extraTypeOutputs = emitOnlyOutputs ? emitOutputs.map((o) => o.libDir) : undefined;

    buildOutputs.forEach((output) => {
      const { libDir, module } = output;
      const cmdLineWithOutput = { ...cmdLine, options: { ...cmdLine.options, outDir: libDir, module } };
      tasks.push({
        name: `Build ${libDir}`,
        exec: createBuildTask({
          ...baseTaskOptions,
          libDir,
          module,
          extraTypeOutputs,
          cmdLine: cmdLineWithOutput,
          buildFiles: cmdLine.fileNames,
        }),
      });
    });
    if (emitOutputs && emitOutputs.length > 0) {
      emitOutputs.forEach((output) => {
        const { libDir, module } = output;
        const cmdLineWithOutput = { ...cmdLine, options: { ...cmdLine.options, outDir: libDir, module } };
        tasks.push({
          name: `Emit ${libDir}`,
          exec: createBuildTask({
            ...baseTaskOptions,
            libDir,
            module,
            cmdLine: cmdLineWithOutput,
            emitFiles: cmdLine.fileNames,
          }),
        });
      });
    }
  } else {
    const checkFiles = cmdLine.fileNames;
    tasks.push({ name: 'Type check', exec: createBuildTask({ ...baseTaskOptions, checkFiles }) });
  }

  for (const task of tasks) {
    task.exec();
  }
}
