import { findConfigFile, readConfigFile, Service } from '@rnx-kit/typescript-service';

const globalService = new Service();

export function checkTypes() {
  const configFileName = findConfigFile(process.cwd());
  if (!configFileName) {
    throw new Error('Could not find a valid tsconfig.json.');
  }
  const parsedCmdLine = readConfigFile(configFileName);
  if (!parsedCmdLine) {
    throw new Error('Could not read tsconfig.json.');
  }

  console.log(parsedCmdLine.fileNames);
  const project = globalService.openProject(parsedCmdLine);
  project.validate();
}
