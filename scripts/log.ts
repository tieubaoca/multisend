import fs from 'fs';

const logFile = 'log.txt';

function info(message: string) {
  fs.appendFileSync(logFile, `[INFO] [${Date().toString()}] ${message}\n`);
  console.log(`[INFO] [${Date().toString()}] ${message}`);
}

function error(message: string) {
  fs.appendFileSync(logFile, `[ERROR] [${Date().toString()}] ${message}\n`);
  console.error(`[ERROR] [${Date().toString()}] ${message}`);
}

export { info, error };
