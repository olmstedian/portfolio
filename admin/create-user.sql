-- SQL script to create admin user in Supabase
-- Alternative method: Create user via SQL (if you have access to auth schema)
-- This requires SUPERUSER privileges or can be done through Supabase Dashboard

-- Option 1: Use Supabase Dashboard (Recommended)
-- Go to: https://supabase.com/dashboard/project/iraexyvraqmzqzglopph/auth/users
-- Click "Add User" > "Create new user"
-- Email: ccakar@spexop.com
-- Password: (your password)
-- Auto Confirm User: ✅

-- Option 2: Via Supabase Auth Admin API (requires service_role key - KEEP SECRET!)
-- You can create a user programmatically using the Supabase Admin API
-- This requires your SERVICE_ROLE key (not the anon key)
-- ⚠️ NEVER expose the service_role key in client-side code!

-- Example using curl (replace YOUR_SERVICE_ROLE_KEY):
/*
curl -X POST 'https://iraexyvraqmzqzglopph.supabase.co/auth/v1/admin/users' \
  -H "apikey: YOUR_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ccakar@spexop.com",
    "password": "your-secure-password",
    "email_confirm": true,
    "user_metadata": {
      "role": "admin"
    }
  }'
*/

-- For most users, use the Supabase Dashboard method above
-- This SQL file is for reference only

