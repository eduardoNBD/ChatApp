const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

function reloadEnv() {
    const envPath = path.resolve(__dirname, '../.env');

  if (fs.existsSync(envPath)) { 
    const envConfig = dotenv.parse(fs.readFileSync(envPath)); 
    for (const k in envConfig) {
      process.env[k] = envConfig[k];
    }
    console.log('  › Variables de entorno recargadas');
  } else {
    console.log('  › No se encontró el archivo .env');
  }
}

module.exports = reloadEnv;