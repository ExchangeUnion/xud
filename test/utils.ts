import net from 'net';
import { SinonSpy } from 'sinon';

/**
 * Discovers and returns a dynamically assigned, unused port available for testing.
 */
export const getUnusedPort = async () => {
  return new Promise<number>((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on('error', reject);
    server.listen(0, () => {
      const { port } = server.address();
      server.close(() => {
        resolve(port);
      });
    });
  });
};

/**
 * Returns a promise wrapper for the spy's property to be truthy
 * @param spy a spy to recursively check.
 * @param property a property that has to eventually become truthy
 * @returns a spy, rejects otherwise.
 */
export const waitForSpy = (spy: SinonSpy, property = 'called') => {
  return new Promise((resolve, reject) => {
    try {
      const checkSpy = (spy: any) => {
        if (spy[property]) return resolve(spy);
        return setTimeout(() => checkSpy(spy));
      };
      checkSpy(spy);
    } catch (e) {
      reject(e);
    }
  });
};
