const styles = (prodId) => (`
  SELECT JSON_BUILD_OBJECT(
    'product_id', ${prodId}::text,
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
  FROM styles st WHERE product_id = ${prodId};
`);

export default styles;
