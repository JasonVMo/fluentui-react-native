export interface OperationSource {
  src?: string;
  symbol?: string;
}

export interface OperationDest {
  dest?: string;
  target?: string;
}

export interface InterfaceToKeys extends OperationSource, OperationDest {
  depth?: number;
}

export type OperationType = 'ToKeys';

export type Operation = {
  operation: OperationType;
} & InterfaceToKeys;

export interface Config {
  operations: Operation[];
}
