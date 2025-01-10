import { findConfigFile, readConfigFile } from '@rnx-kit/typescript-service';
import ts from 'typescript';

import { BuildTask, BuildTaskOptions, createBuildTask } from './createBuildTask';
import { createBatchWriter, FileWriter } from './fileWriter';
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

type BuildTaskEntry = { name: string; exec: BuildTask };

export function buildTypescriptWorker(
  { srcDir = 'src', outputs, compilerOptions }: BuildTypescriptOptions,
  writeFile: FileWriter,
): BuildTaskEntry[] {
  const pkgRoot = process.cwd();
  const cmdLine = getBaseConfig(pkgRoot, { ...defaultOptions, ...sanitizeOptions(compilerOptions) });
  const tasks: BuildTaskEntry[] = [];
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
        exec: createBuildTask(
          {
            ...baseTaskOptions,
            libDir,
            module,
            extraTypeOutputs,
            cmdLine: cmdLineWithOutput,
            buildFiles: cmdLine.fileNames,
          },
          writeFile,
        ),
      });
    });
    if (emitOutputs && emitOutputs.length > 0) {
      emitOutputs.forEach((output) => {
        const { libDir, module } = output;
        const cmdLineWithOutput = { ...cmdLine, options: { ...cmdLine.options, outDir: libDir, module } };
        tasks.push({
          name: `Emit ${libDir}`,
          exec: createBuildTask(
            {
              ...baseTaskOptions,
              libDir,
              module,
              cmdLine: cmdLineWithOutput,
              emitFiles: cmdLine.fileNames,
            },
            writeFile,
          ),
        });
      });
    }
  } else {
    const checkFiles = cmdLine.fileNames;
    tasks.push({ name: 'Type check', exec: createBuildTask({ ...baseTaskOptions, checkFiles }) });
  }
  return tasks;
}

export function buildTypescript(options: BuildTypescriptOptions): void {
  const tasks = buildTypescriptWorker(options, ts.sys.writeFile);
  for (const task of tasks) {
    task.exec();
  }
}

export async function buildTypescriptAsync(options: BuildTypescriptOptions): Promise<void> {
  const fileBatch = createBatchWriter();
  const tasks = buildTypescriptWorker(options, fileBatch.writeFile);

  await Promise.all(tasks.map((task) => task.exec()));
  return new Promise<void>((resolve, reject) => {
    fileBatch.finishBatch().then((errors) => {
      if (errors && errors.length > 0) {
        errors.forEach((err) => console.error(err));
        reject(new Error('Failed to write files'));
      } else {
        resolve();
      }
    });
  });
}
