`SELECT * FROM product WHERE id = ${product_id}`
explain analyze
SELECT JSON_BUILD_OBJECT(
  'name', name,
  'slogan', slogan,
  'description', description,
  'category', category,
  'default_price', default_price,
  'created_at', created_at,
  'updated_at', updated_at,
  'campus', campus,
  'features', (
    SELECT ARRAY_TO_JSON(ARRAY_AGG(
      JSON_BUILD_OBJECT(
        'feature', feature,
        'value', value
      )
    ))
    FROM features WHERE product_id=999999
  )
)
FROM product WHERE id = 999999;


SELECT ARRAY_TO_JSON(ARRAY_AGG(
  JSON_BUILD_OBJECT(
    feature, value
  )
))
FROM features WHERE product_id = 100003
AND value!='null'


EXPLAIN ANALYZE
SELECT ARRAY_TO_JSON(ARRAY_AGG(
  related_product_id
)) FROM related WHERE product_id=${product_id}


EXPLAIN ANALYZE
SELECT JSON_BUILD_OBJECT(
  'product_id', 3,
  'results', ARRAY_TO_JSON(ARRAY_AGG(
    JSON_BUILD_OBJECT(
      'style_id', st.style_id,
      'name', st.name,
      'sale_price', st.sale_price,
      'original_price', st.original_price,
      'default?', st."default?",
      'photos', (
        SELECT ARRAY_TO_JSON(ARRAY_AGG(
          JSON_BUILD_OBJECT(
            'thumbnail_url', ph.thumbnail_url,
            'url', ph.url
          )
        ))
        FROM photos ph WHERE ph.style_id = st.style_id
      ),
      'skus', (
        SELECT JSON_OBJECT_AGG(
          sk.sku_id, JSON_BUILD_OBJECT(
          'size', sk.size,
          'quantity', sk.quantity
            )
            )
        FROM skus sk WHERE sk.style_id = st.style_id
      )
    )
  ))
)
FROM styles st WHERE product_id = 3;




-- SELECT c.key,
--        c.x_key,
--        c.tags,
--        x.name
--  FROM context c
--  JOIN x
--    ON c.x_key = x.key
-- WHERE c.key = ANY (VALUES (15368196), -- 11,000 other keys --)
--   AND c.x_key = 1
--   AND c.tags @> ARRAY[E'blah'];

-- SELECT c.key,
--        c.x_key,
--        c.tags,
--        x.name
--  FROM context c
--  JOIN x
--    ON c.x_key = x.key
-- WHERE c.key = ANY (ARRAY[15368196, -- 11,000 other keys --)])
--   AND c.x_key = 1
--   AND c.tags @> ARRAY[E'blah'];