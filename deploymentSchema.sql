CREATE TABLE skus(
  sku_id INT NOT NULL,
  style_id INT NOT NULL,
  size VARCHAR(20) NOT NULL,
  quantity INT NOT NULL,
  PRIMARY KEY(sku_id)
);

COPY skus
FROM '/Users/irvin/Desktop/skus.csv'(
  FORMAT CSV,
  HEADER TRUE
);

CREATE INDEX skustable_style_id ON skus(style_id);


CREATE TABLE photos(
  id INT NOT NULL,
  style_id INT NOT NULL,
  url VARCHAR(300),
  thumbnail_url VARCHAR(300),
  PRIMARY KEY(id)
);

COPY photos
FROM '/Users/irvin/Desktop/photos.csv'(
  QUOTE '''',
  FORMAT CSV,
  HEADER TRUE
);

UPDATE photos
SET url = replace(url, '"', '');

UPDATE photos
SET thumbnail_url = replace(thumbnail_url, '"', '');

CREATE INDEX photostable_style_id ON photos(style_id);


CREATE TABLE product(
  id INT NOT NULL,
  name VARCHAR(120) NOT NULL,
  slogan VARCHAR(400) NOT NULL,
  description VARCHAR(1000) NOT NULL,
  category VARCHAR(40) NOT NULL,
  default_price VARCHAR(30) NOT NULL,
  created_at DATE NOT NULL DEFAULT current_timestamp,
  updated_at DATE NOT NULL DEFAULT current_timestamp,
  campus VARCHAR(10) NOT NULL DEFAULT 'hr-rfe',
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
FROM '/Users/irvin/Desktop/product.csv'(
  FORMAT CSV,
  HEADER TRUE
);


CREATE TABLE features(
  id INT NOT NULL,
  product_id INT NOT NULL,
  feature VARCHAR(40),
  value VARCHAR(50),
  PRIMARY KEY(id)
);

COPY features
FROM '/Users/irvin/Desktop/features.csv'(
FORMAT CSV,
HEADER TRUE,
NULL 'null',
FORCE_NULL (value)
);

CREATE INDEX feeaturesTable_product_id ON features(product_id);

CREATE TABLE styles(
  style_id INT NOT NULL,
  product_id INT NOT NULL,
  name VARCHAR(30) NOT NULL,
  sale_price VARCHAR(20),
  original_price VARCHAR(20) NOT NULL,
  "default?" BOOLEAN NOT NULL,
  PRIMARY KEY(style_id)
);

COPY styles
FROM '/Users/irvin/Desktop/styles.csv'(
  FORMAT CSV,
  HEADER TRUE,
  NULL 'null',
  FORCE_NULL (sale_price)
);

UPDATE styles
SET sale_price = concat(sale_price,'.00')
WHERE  sale_price IS NOT NULL;

UPDATE styles
SET original_price = concat(original_price,'.00')
WHERE  original_price IS NOT NULL;

CREATE INDEX stylesTable_product_id_style_id ON styles(product_id);


CREATE TABLE cart(
  id INT NOT NULL,
  user_session VARCHAR(30) NOT NULL,
  skus_id VARCHAR(10) NOT NULL,
  active SMALLINT,
  PRIMARY KEY(id)
);

COPY cart
FROM '/Users/irvin/Desktop/cart.csv'(
  FORMAT CVS,
  HEADER TRUE
);


CREATE TABLE related(
  id INT NOT NULL,
  product_id INT NOT NULL,
  related_product_id INT NOT NULL,
  PRIMARY KEY(id)
);

COPY related FROM '/Users/irvin/Desktop/related.csv'(
  FORMAT CSV,
  HEADER TRUE
);


