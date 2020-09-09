

//import * as baseJson from './fluentui.json';
import { Leaf, FluentJson } from './parseFluentJson';

const parseRules = {
  Meta: {
    _hide: true },
  Global: {
    _resolve: true,
    _name: 'globals',
    Color: {
      _name: 'colors',
      _path: '',
      Blue: { _hide: true }
    }
  },
  Set: {
    _name: 'alias'
  },
  default: {
    _path: 'components'
  }
}

interface KeyedEntry {
  newKey: string;
  oldKey: string;
  node: Leaf;
  hidden?: boolean;
  resolve?: boolean;
}

interface KeyedEntryLookup {
  [key: string]: KeyedEntry;
}

interface KeyedEntries {
  byOldKey: KeyedEntryLookup;
  byNewKey: KeyedEntryLookup;
}

function mapEntry(map: KeyedEntries, entry: KeyedEntry): void {
  map.byOldKey[entry.oldKey] = entry;
  map.byNewKey[entry.newKey] = entry;
}

function pathJoin(root: string, branch: string, newPath?: boolean): string {
  if (newPath && branch) {
    branch = branch.replace(/^\w/, s => s.toLowerCase());
  }
  return [root, branch].filter(s => s).join('.');
}

function addKeyEntries(map: KeyedEntries, source: FluentJson | Leaf, rule: any, oldPath: string, oldBranch: string, newRoot: string, newLeaf: string, hidden?: boolean, resolve?: boolean): void {
  oldPath = pathJoin(oldPath, oldBranch);
  newRoot = rule?._path ?? newRoot;
  const newBranch = rule?._name ?? oldBranch;
  if (rule) {
    // if we have a parse rule this node gets added to the new path
    newRoot = pathJoin(newRoot, newBranch);
    hidden = rule._hide ?? hidden;
    resolve = rule._resolve ?? resolve;
  } else {
    // otherwise start building up the leaf name
    newLeaf = newLeaf + newBranch;
  }

  // if this is a leaf node then finish it off
  if (source.value !== undefined || source.aliasOf) {
    mapEntry(map, { hidden, oldKey: oldPath, newKey: pathJoin(newRoot, newLeaf, true), node: source, resolve });
  } else {
    // otherwise recurse children
    Object.keys(source).forEach(key => {
      const newSource = source[key];
      const newRule = rule && (rule[key] || rule.default) || undefined;
      if (typeof newSource === 'object') {
        addKeyEntries(map, newSource, newRule, oldPath, key, newRoot, newLeaf, hidden, resolve);
      }
    })
  }
}

function getCycleDetector(): (value: string) => boolean {
  const seen: { [key: string]: boolean } = {};
  return v => (!v || seen[v] ? false : seen[v] = true);
}

function resolveAliases(keyMap: KeyedEntries): void {
  const byNewKey = keyMap.byNewKey;
  // change old aliases to new aliases
  Object.keys(byNewKey).forEach(key => {
    const entry = byNewKey[key];
    if (entry.node?.aliasOf) {
      const newVal = keyMap.byOldKey[entry.node.aliasOf]?.newKey;
      entry.node = newVal ? { aliasOf: newVal } : { value: undefined };
    }
  });

  // resolve aliases for entries marked as resolve
  Object.keys(byNewKey).forEach(key => {
    const entry = byNewKey[key];
    if (entry.resolve) {
      const accept = getCycleDetector();
      while (accept(entry.node?.aliasOf)) {
        entry.node = byNewKey[entry.node.aliasOf].node;
      }
    }
  })
}

function ensureEntry(root: FluentJson | Leaf, key: string, entry: KeyedEntry): void {
  if (!entry.hidden) {
    const parts = key.split('.');
    for (const part of parts) {
      root[part] = root[part] || {};
      root = root[part];
    }
    Object.assign(root, entry.node);
  }
}

export function transformFluentJson(fluentJson: FluentJson): FluentJson {
  // parse the structure into keys
  const keyMap: KeyedEntries = { byNewKey: {}, byOldKey: {} };
  addKeyEntries(keyMap, fluentJson, parseRules, '', '', '', '');

  // resolve any aliases
  resolveAliases(keyMap);

  // now build a new object in the new key shape
  const newObject = {};
  Object.keys(keyMap.byNewKey).sort((a: string, b: string) => (a < b) ? -1 : 1).forEach(key => {
    ensureEntry(newObject, key, keyMap.byNewKey[key]);
  });

  return newObject;
}
