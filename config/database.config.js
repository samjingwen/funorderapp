require('dotenv').config();
const fs = require('fs');

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'fruitshop',
  connectionLimit: 4,
}


// if (fs.existsSync(process.env.DB_CA_CERT)) {
//   console.log('reading from file system...');
//   dbConfig.ssl = {
//     ca: fs.readFileSync(process.env.DB_CA_CERT)
//   }
// } else {
//   console.log('using env...');
//   dbConfig.ssl = {
//     ca: process.env.DB_CA
//   }
// }

module.exports = dbConfig;
