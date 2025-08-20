-- Insert sample products for the girly ecommerce site
INSERT INTO products (name, description, price, image_url, category, stock_quantity, is_featured) VALUES
('Pink Sparkle Lip Gloss', 'Ultra-shiny lip gloss with pink sparkles for the perfect girly look', 12.99, '/placeholder.svg?height=300&width=300', 'Beauty', 50, true),
('Rose Gold Phone Case', 'Elegant rose gold phone case with crystal accents', 24.99, '/placeholder.svg?height=300&width=300', 'Accessories', 30, true),
('Fluffy Pink Slippers', 'Super soft and fluffy pink slippers for ultimate comfort', 18.99, '/placeholder.svg?height=300&width=300', 'Fashion', 25, false),
('Unicorn Hair Clips Set', 'Set of 6 adorable unicorn-themed hair clips', 8.99, '/placeholder.svg?height=300&width=300', 'Accessories', 40, true),
('Glittery Nail Polish Set', 'Collection of 5 glittery nail polishes in pastel colors', 29.99, '/placeholder.svg?height=300&width=300', 'Beauty', 20, false),
('Heart-Shaped Sunglasses', 'Trendy heart-shaped sunglasses in pink frames', 15.99, '/placeholder.svg?height=300&width=300', 'Accessories', 35, true),
('Kawaii Plush Keychain', 'Cute kawaii-style plush keychain in various characters', 6.99, '/placeholder.svg?height=300&width=300', 'Accessories', 60, false),
('Holographic Makeup Bag', 'Spacious holographic makeup bag with zipper closure', 22.99, '/placeholder.svg?height=300&width=300', 'Beauty', 15, true),
('Butterfly Hair Scrunchies', 'Set of 4 scrunchies with butterfly decorations', 11.99, '/placeholder.svg?height=300&width=300', 'Fashion', 45, false),
('Crystal Phone Ring Holder', 'Sparkly crystal phone ring holder in various colors', 9.99, '/placeholder.svg?height=300&width=300', 'Accessories', 55, false);

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (username, password_hash) VALUES
('admin', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ');
