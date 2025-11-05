-- Add phone column to existing orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(20);

-- Create index for the new phone column
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(customer_phone);