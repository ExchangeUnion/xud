import fs from 'fs';
import { promisify } from 'util';

// Promisified wrappers for file system methods - only required for support for NodeJS v9 and older
// NodeJS v10 provides promisified file system methods out of the box

/** A promisified wrapper for the NodeJS `fs.readFile` method. */
export const readFile = promisify(fs.readFile);

/** A promisified wrapper for the NodeJS `fs.mkdir` method. */
export const mkdir = promisify(fs.mkdir);

/** A promisified wrapper for the NodeJS `fs.exists` method. */
export const exists = promisify(fs.exists);

/** A promisified wrapper for the NodeJS `fs.readdir` method. */
export const readdir = promisify(fs.readdir);

/** A promisified wrapper for the NodeJS `fs.writeFile` method. */
export const writeFile = promisify(fs.writeFile);
