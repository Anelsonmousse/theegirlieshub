-- Create a function to update product stock safely
CREATE OR REPLACE FUNCTION update_product_stock(product_id UUID, quantity_sold INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products 
  SET stock_quantity = GREATEST(0, stock_quantity - quantity_sold),
      updated_at = NOW()
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;
