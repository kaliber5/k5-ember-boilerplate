const fs = require('fs');

const DEFAULT_DOTENV_NAME = 'mirage-normal';

module.exports = function(env) {
  const dotenvName =
    (process.env.DOTENV && process.env.DOTENV.length > 0)
      ? process.env.DOTENV
      : DEFAULT_DOTENV_NAME;

  const dotenvFileName = `.env-${dotenvName}`;

  if (fs.existsSync(dotenvFileName)) {
    console.info(`Using dotenv file: ${dotenvFileName}`);
  } else {
    console.warn(`dot-env file not found: ${dotenvFileName}, assuming env vars are passed manually`);
  }

  return {
    clientAllowedKeys: [],
    // Fail build when there is missing any of clientAllowedKeys environment variables.
    // By default false.
    failOnMissingKey: false,
    path: dotenvFileName,
  };
};
