
const { Pool, Client } = require('pg');
const fastcsv = require('fast-csv');
// const fs = require('fs');

const pool = new Pool({
  database: 'productservices',
  max?: 10,
  allowExitOnIdle?: false
});
pool.query('SELECT id from product limit 5', (err, res) => {
  pool.end()
})

// const stream = fs.createReadStream('bezkoder.csv');//file read
// const csvData = [];
// const csvStream = fastcsv //parsing function
//   .parse()
//   .on('data', (data) => {
//     csvData.push(data);
//   })
//   .on('end', () => {
//     csvData.shift();
//     const pool = new Pool({
//       database: 'productservices',
//     });
//     const query = 'INSERT INTO category (id, name, description, created_at) VALUES ($1, $2, $3, $4)';
//     pool.connect((err, client, done) => {
//       if (err) throw err;
//       try {
//         csvData.forEach((row) => {
//           client.query(query, row, (err, res) => {
//             if (err) {
//               console.log(err.stack);
//             } else {
//               console.log(`inserted ${res.rowCount} row:`, row);
//             }
//           });
//         });
//       } finally {
//         done();
//       }
//     });
//   });
// stream.pipe(csvStream); // stream + parsing function
