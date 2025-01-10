import events from 'events';
import fs from 'fs';

export type FileWriter = (path: string, content: string) => void;

type WriteFileNode = {
  path: fs.PathLike | number;
  data: any;
  batch: BatchHelper;
  next: WriteFileNode;
};

const writeEvent = 'writeMore';

/**
 * A queue for writing files to disk, ensuring that only a certain number of writes are performed concurrently
 */
class WriteQueue {
  private maxConcurrentWrites: number;
  private retriggerDelta: number;
  private firstWriteNode: WriteFileNode = null;
  private lastWriteNode: WriteFileNode = null;
  private currentWrites = 0;
  private emitter: events.EventEmitter = new events.EventEmitter();
  private eventSent = false;

  /**
   * Create a new write queue
   *
   * @param maxConcurrentWrites - max number of writes to perform concurrently
   * @param retriggerDelta - number of writes to wait for before retriggering the loop
   */
  constructor(maxConcurrentWrites: number, retriggerDelta = 1) {
    this.maxConcurrentWrites = maxConcurrentWrites;
    this.retriggerDelta = retriggerDelta;
    this.emitter.on(writeEvent, () => {
      this.eventSent = false;
      this.processWrites();
    });
  }

  /**
   * Write a file to disk
   *
   * @param path - path to write to
   * @param data - data to write
   * @param batch - batch helper to notify when the write is complete
   */
  public writeFile(path: fs.PathLike | number, data: any, batch: BatchHelper) {
    if (this.currentWrites < this.maxConcurrentWrites) {
      this.startWrite(path, data, batch);
    } else {
      this.enqueue(path, data, batch);
    }
  }

  private startWrite(path: fs.PathLike | number, data: any, batch: BatchHelper) {
    this.currentWrites++;
    fs.writeFile(path, data, (err) => {
      this.currentWrites--;
      batch.writeDone(err);
      if (this.shouldResume()) {
        this.eventSent = true;
        this.emitter.emit(writeEvent);
      }
    });
  }

  private enqueue(path: fs.PathLike | number, data: any, batch: BatchHelper) {
    const writeNode = { path, data, batch, next: null };
    if (this.lastWriteNode) {
      this.lastWriteNode.next = writeNode;
    } else {
      this.firstWriteNode = writeNode;
    }
    this.lastWriteNode = writeNode;
  }

  private dequeue(): WriteFileNode | null {
    const writeNode = this.firstWriteNode;
    if (writeNode) {
      this.firstWriteNode = writeNode.next;
      if (this.firstWriteNode === null) {
        this.lastWriteNode = null;
      }
    }
    return writeNode;
  }

  private shouldResume() {
    return this.currentWrites <= this.maxConcurrentWrites - this.retriggerDelta && this.firstWriteNode && !this.eventSent;
  }

  private processWrites() {
    while (this.currentWrites < this.maxConcurrentWrites && this.firstWriteNode) {
      const { path, data, batch } = this.dequeue();
      this.startWrite(path, data, batch);
    }
  }
}

// create a global write queue to ensure we don't write too many files at once
const writeQueue = new WriteQueue(30);

/**
 * Helper class for managing a batch of file writes
 */
class BatchHelper {
  public errors: NodeJS.ErrnoException[];
  public resolvePromise: (errors: NodeJS.ErrnoException[] | null) => void;

  private active: number;
  private waiting: boolean;

  constructor() {
    this.active = 0;
    this.errors = [];
    this.waiting = false;
  }

  public writeFile(path: string, content: string) {
    this.active++;
    writeQueue.writeFile(path, content, this);
  }

  public writeDone(err: NodeJS.ErrnoException | null) {
    if (err) {
      this.errors.push(err);
    }
    this.active--;
    if (this.finished()) {
      this.resolvePromise(this.errors);
    }
  }

  public finished() {
    return this.waiting && this.active === 0;
  }
}

/**
 * Create a new file writer for a batch of files (like those in a given directory) that can be queried for completion
 */
export function createBatchWriter() {
  const helper = new BatchHelper();
  const waitForFinish = new Promise<NodeJS.ErrnoException[] | null>((resolve) => {
    helper.resolvePromise = resolve;
    if (helper.finished()) {
      resolve(helper.errors);
    }
  });

  return {
    // write out a file concurrently
    writeFile: (path: string, content: string) => {
      helper.writeFile(path, content);
    },
    // wait for all writes in this batch to finish and return collected errors
    finishBatch: async () => {
      return Promise.resolve(waitForFinish);
    },
  };
}
