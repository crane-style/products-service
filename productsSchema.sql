--connect to NOT productservices
DROP DATABASE IF EXISTS productservices;
CREATE DATABASE productservices;
--connect to productservices
DROP TABLE IF EXISTS product;
CREATE TABLE product(
  id INT NOT NULL,
  name VARCHAR(120) NOT NULL,
  slogan VARCHAR(400) NOT NULL,
  description VARCHAR(1000) NOT NULL,
  category VARCHAR(40) NOT NULL,
  default_price VARCHAR(30) NOT NULL,
  created_at DATE NOT NULL DEFAULT current_timestamp,
  updated_at DATE NOT NULL DEFAULT current_timestamp,
  campus SMALLINT NOT NULL DEFAULT 1,
  PRIMARY KEY(id)
);
COPY product(
  id,
  name,
  slogan,
  description,
  category,
  default_price
)
  FROM '/Users/irvin/Desktop/product.csv'
  csv header;

DROP TABLE IF EXISTS features;
CREATE TABLE features(
  id INT NOT NULL,
  product_id INT NOT NULL,
  feature VARCHAR(40),
  value VARCHAR(50),
  PRIMARY KEY(id)
);
COPY features
  FROM '/Users/irvin/Desktop/features.csv'
  csv header;

DROP TABLE IF EXISTS styles;
CREATE TABLE styles(
  id INT NOT NULL,
  product_id INT NOT NULL,
  name VARCHAR(30) NOT NULL,
  sale_price VARCHAR(20),
  original_price VARCHAR(20) NOT NULL,
  default_style BOOLEAN NOT NULL,
  PRIMARY KEY(id)
);
COPY styles
  FROM '/Users/irvin/Desktop/styles.csv'
  csv header;

DROP TABLE IF EXISTS cart;
CREATE TABLE cart(
  id INT NOT NULL,
  user_session VARCHAR(30) NOT NULL,
  skus_id VARCHAR(10) NOT NULL,
  active CHAR(1),
  PRIMARY KEY(id)
);
COPY cart
  FROM '/Users/irvin/Desktop/cart.csv'
  csv header;

DROP TABLE IF EXISTS skus;
CREATE TABLE skus(
  id VARCHAR(10) NOT NULL,
  style_id INT NOT NULL,
  size VARCHAR(20) NOT NULL,
  quanity INT NOT NULL,
  PRIMARY KEY(id)
);
COPY skus
  FROM '/Users/irvin/Desktop/skus.csv'
  csv header;

DROP TABLE IF EXISTS photos;
CREATE TABLE photos(
  id INT NOT NULL,
  style_id INT NOT NULL,
  url VARCHAR(300),
  thumbnail_url VARCHAR(300),
  PRIMARY KEY(id)
);
COPY photos
  FROM '/Users/irvin/Desktop/photos.csv'
  quote ''''
  csv