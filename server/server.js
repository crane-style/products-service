import express from 'express';
import pk from 'pg';
import dotenv from 'dotenv';
import stylesQuery from '../dbHelpers.js';

const { Pool } = pk;

dotenv.config();

// import cluster from 'cluster';
// import os from 'os';
// const numCPUs = os.cpus().length;

const db = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  password: process.env.PGPW,
  database: process.env.PGDB,
  'max?': process.env.PGCLIENTS,
});
db.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// if (cluster.isMaster) {
//   for (let i = 0; i < numCPUs; i += 1) {
//     // Create a worker
//     cluster.fork();
//   }
// } else {
const app = express();
app.use(express.json());
app.get('/product', (req, res) => {
  let count = Number.parseFloat(req.query.count);
  let page = Number.parseFloat(req.query.page);
  count = Number.isInteger(count) ? count : 5;
  page = Number.isInteger(page) || page === 0 ? page : 1;
  db.connect()
    .then((client) => client.query(`SELECT *
    FROM product
    WHERE (
      id > ${count * page - count} AND id <  ${count * page})`)
      .then((dbRes) => {
        client.release();
        res.status(200).json(dbRes.rows);
      })
      .catch((err) => {
        client.realease();
        res.status(500).send(err.stack);
      }))
    .catch((err) => res.status(500).send(err));
});

app.get('/product/:product_id', (req, res) => {
  let product_id = Number.parseFloat(req.params.product_id);
  if (!Number.isInteger(product_id)) {
    res.status(404).send('Invalid product ID input');
  } else {
    db.connect()
      .then((client) => {
        client.query(`
        SELECT JSON_BUILD_OBJECT(
          'name', name,
          'slogan', slogan,
          'description', description,
          'category', category,
          'default_price', default_price,
          'created_at', created_at,
          'updated_at', updated_at,
          'campus', campus,
          'features', (SELECT ARRAY_TO_JSON(ARRAY_AGG(
            JSON_BUILD_OBJECT(
              'feature', feature,
              'value', value
            )
          ))
          FROM features WHERE product_id = ${product_id}
          AND value!='null')
        )
        FROM product WHERE id = ${product_id};
        `)
          .then((dbRes) => {
            client.release();
            res.status(200).json(dbRes.rows[0].json_build_object)
          })
          .catch((err) => {
            client.release();
            res.status(500).send(err.stack);
          });
      });
  }
});

app.get('/product/:product_id/styles', (req, res) => {
  let product_id = Number.parseFloat(req.params.product_id);
  if (!Number.isInteger(product_id)) {
    res.status(404).send('Invalid product ID format');
  } else {
    db.connect()
      .then((client) => {
        client.query(stylesQuery(product_id))
          .then((dbRes) => {
            client.release();
            res.status(200).send(dbRes.rows[0].json_build_object);
          })
          .catch((err) => {
            client.release();
            res.status(400).send(err.stack);
          });
      })
      .catch((err) => res.status(500).send(err));
  }
});

app.get('/product/:product_id/related', (req, res) => {
  let product_id = Number.parseFloat(req.params.product_id);
  if (!Number.isInteger(product_id)) {
    res.status(404).send('Invalid product ID format');
  } else {
    db.connect()
      .then((client) => {
        client.query(`
        SELECT ARRAY_TO_JSON(ARRAY_AGG(
          related_product_id
        )) FROM related WHERE product_id=${product_id}`)
          .then((dbRes) => {
            const relatedProds = [];
            dbRes.rows.forEach((idObj) => relatedProds.push(idObj.related_product_id));
            client.release();
            res.status(200).json(relatedProds);
          })
          .catch((err) => {
            client.release();
            res.sendStatus(400);
          });
      });
  }
});

app.get('/cart', (req, res) => {
  res.sendStatus(200);
});

app.post('/cart', (req, res) => {
  res.sendStatus(201);
});

const server = app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log('server error', err);
  } else {
    console.log('server listening on port ', process.env.PORT);
  }
});

process.on('SIGINT', () => {
  server.close(() => {
    db.end();
    console.log('HTTP server closed');
  });
});
// }
