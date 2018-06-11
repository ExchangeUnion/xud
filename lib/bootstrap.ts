import dotenv from 'dotenv';

export default () => {
  /** Loads environment variables from the file .env */
  dotenv.config();

  /** rethrow unhandled promise rejection, to crash process of an unwrapped instance */
  process.on('unhandledRejection', (err) => {
    console.log(err);
    throw err;
  });
};
