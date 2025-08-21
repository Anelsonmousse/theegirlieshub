// run-migration.cjs
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config() // Automatically finds .env file

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔍 Checking environment variables...')
console.log('Supabase URL:', supabaseUrl ? '✅ Found' : '❌ Missing')
console.log('Service Role Key:', supabaseServiceKey ? '✅ Found' : '❌ Missing')

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.log('\n📋 Make sure your .env file contains:')
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url')
  console.log('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  try {
    console.log('🔄 Running migration: Add phone column to orders table')
    
    // Add the phone column
    console.log('📝 Adding customer_phone column...')
    
    const { error: alterError } = await supabase.rpc('exec', {
      sql: `ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(20);`
    })
    
    if (alterError) {
      throw alterError
    }
    
    console.log('✅ Column added successfully!')
    
    // Add the index
    console.log('📝 Creating index...')
    const { error: indexError } = await supabase.rpc('exec', {
      sql: `CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(customer_phone);`
    })
    
    if (indexError) {
      console.warn('⚠️ Index creation warning:', indexError.message)
    } else {
      console.log('✅ Index created successfully!')
    }
    
    console.log('🎉 Migration completed successfully!')
    console.log('💡 You can now use the phone number field in your checkout form!')
    
  } catch (err) {
    console.error('❌ Migration failed:', err.message)
    console.log('\n💡 Alternative: Run this SQL manually in Supabase dashboard:')
    console.log('─'.repeat(60))
    console.log('ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(20);')
    console.log('CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(customer_phone);')
    console.log('─'.repeat(60))
  }
}

runMigration()