import express from 'express';
import { Pool } from 'pg';
import styles from '../dbHelpers';

require('dotenv').config();
// const express = require('express');
// const { Pool } = require('pg');
// const cluster = require('cluster');
// const numCPUs = require('os').cpus().length;

const db = new Pool({
  database: 'productservices',
  'max?': 100,
  'allowExitOnIdle?': false,
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
    .then((client) => client.query(`SELECT * FROM product LIMIT ${count} OFFSET ${count * page - count}`)
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
        client.query(`SELECT * FROM product WHERE id = ${product_id}`)
          .then((dbRes) => {
            client.query(`SELECT feature, value FROM features WHERE product_id=${product_id} AND value!='null'`)
              .then((dbRes2) => {
                client.release();
                dbRes.rows[0].features = dbRes2.rows;
                res.status(200).json(dbRes.rows);
              })
              .catch((err) => {
                client.release();
                res.status(500).send(err.stack);
              });
          })
          .catch((err) => {
            client.release(err.stack);
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
    const resObj = {};
    resObj.product_id = product_id.toString();
    db.connect()
      .then((client1) => {
        client1.query(`SELECT style_id, name, sale_price, original_price, "default?" FROM styles WHERE product_id = ${product_id}`)
          .then((dbRes1) => {
            client1.release();
            resObj.results = dbRes1.rows;
            return Promise.allSettled(resObj.results.map((styleObj, i) => Promise.all([
              db.connect()
                .then((mapClient) => mapClient.query(`SELECT thumbnail_url, url FROM photos WHERE style_id = ${styleObj.style_id}`)
                  .then((dbRes2) => {
                    mapClient.release();
                    resObj.results[i].photos = dbRes2.rows;
                  })),
              db.connect()
                .then((mapClient2) => mapClient2.query(`SELECT sku_id, size, quantity FROM skus where style_id= ${styleObj.style_id}`)
                  .then((dbRes3) => {
                    resObj.results[i].skus = {};
                    dbRes3.rows.forEach((skuDeetsObj) => {
                      const { sku_id, size, quantity } = skuDeetsObj;
                      resObj.results[i].skus[sku_id] = { size, quantity };
                    });
                    mapClient2.release();
                  }))])));
          })
          .then(() => {
            res.status(200).json(resObj);
          })
          .catch((err) => {
            res.sendStatus(400);
          });
      })
      .catch((err) => console.log('dc connection err ', err));
  }
});

app.get('/product/:product_id/related', (req, res) => {
  let product_id = Number.parseFloat(req.params.product_id);
  if (!Number.isInteger(product_id)) {
    res.status(404).send('Invalid product ID format');
  } else {
    db.connect()
      .then((client) => {
        client.query(`SELECT related_product_id FROM related WHERE product_id=${product_id}`)
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
