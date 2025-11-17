# Portfolio Admin Panel

Admin interface for managing portfolio projects using Supabase.

## Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Note your project URL and anon key from Settings > API

### 2. Configure Supabase

✅ **Already configured!** Your Supabase credentials have been set up in:

- `admin/supabase-config.js`
- `js/supabase-api.js`

Your Supabase project URL: `https://iraexyvraqmzqzglopph.supabase.co`

### 3. Set Up Database Schema

✅ **SQL file created!** Run the SQL from `admin/setup.sql` in your Supabase SQL Editor:

Go to: <https://supabase.com/dashboard/project/iraexyvraqmzqzglopph/sql>

Or run this SQL:

```sql
-- Create projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  technologies TEXT[] DEFAULT '{}',
  roles TEXT[] DEFAULT '{}',
  github TEXT,
  demo TEXT,
  featured BOOLEAN DEFAULT false,
  confidential BOOLEAN DEFAULT false,
  macos_window BOOLEAN DEFAULT false,
  classification TEXT,
  development_status TEXT,
  development_timeline TEXT,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true
);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read active projects
CREATE POLICY "Anyone can view active projects"
  ON projects FOR SELECT
  USING (active = true);

-- Policy: Only authenticated users can insert/update/delete
CREATE POLICY "Authenticated users can manage projects"
  ON projects FOR ALL
  USING (auth.role() = 'authenticated');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 4. Create Admin User

**Your Admin Credentials:**

- Email: `ccakar@spexop.com`
- Password: (Use the password you've set)

1. Go to [Authentication > Users](https://supabase.com/dashboard/project/iraexyvraqmzqzglopph/auth/users) in Supabase dashboard
2. Click "Add User" > "Create new user"
3. Enter:
   - Email: `ccakar@spexop.com`
   - Password: (your secure password)
   - Auto Confirm User: ✅ (check this to skip email verification)
4. Click "Create user"
5. Use these credentials to log into the admin panel at `admin/index.html`

**Note:** For security, store passwords securely and never commit them to version control.

### 5. Configure Public Portfolio

1. Open `js/supabase-api.js`
2. Replace `YOUR_SUPABASE_URL` with your Supabase project URL
3. Replace `YOUR_SUPABASE_ANON_KEY` with your Supabase anon key

The public portfolio will automatically fetch from Supabase, with a fallback to static data if Supabase is not configured.

## Usage

### Access Admin Panel

Navigate to `admin/index.html` in your browser or visit:

```bash
https://yourdomain.com/admin/
```

### Features

- **Login**: Secure authentication using Supabase Auth
- **View Projects**: See all projects in a list view
- **Add Project**: Create new portfolio projects
- **Edit Project**: Update existing projects
- **Delete Project**: Remove projects
- **Project Fields**:
  - Title, Description, Image URL
  - GitHub and Demo links
  - Technologies (comma-separated)
  - Roles (comma-separated)
  - Classification and development status
  - Featured, Confidential, macOS Window style toggles
  - Display order for sorting

### Migrating Existing Projects

**✅ SQL Migration Script Created!**

The easiest way to migrate all your existing projects:

1. **Run the SQL migration script:**
   - Go to [SQL Editor](https://supabase.com/dashboard/project/iraexyvraqmzqzglopph/sql)
   - Copy the contents of `admin/migrate-projects.sql`
   - Paste and run it
   - All 10 projects will be imported automatically

2. **Or use the admin panel:**
   - Open `admin/index.html` and log in
   - For each project in `js/projects-data.js`:
     - Click "Add Project"
     - Fill in all the fields matching the static data
     - Save

**Note:** The SQL script will insert all projects from `projects-data.js` with the correct structure. If you've already run `setup.sql`, you can run `migrate-projects.sql` directly.

### Adding Multiple Images to Projects (Image Carousel)

To support multiple images per project that display in a carousel:

1. **Run the images column migration:**
   - Go to [SQL Editor](https://supabase.com/dashboard/project/iraexyvraqmzqzglopph/sql)
   - Copy the contents of `admin/add-images-column.sql`
   - Paste and run it
   - This will add an `images` TEXT[] column and update the Spexop-UI project with sample images

2. **Update image URLs:**
   - The migration includes placeholder URLs - replace them with your actual image URLs
   - Images should be hosted (CDN, GitHub Pages assets, etc.)
   - Update the Spexop-UI project or any other project:

```sql
UPDATE projects 
SET images = ARRAY[
  'https://your-cdn.com/image1.jpg',
  'https://your-cdn.com/image2.jpg',
  'https://your-cdn.com/image3.jpg'
]
WHERE title = 'Spexop-UI';
```

3. **The carousel will automatically appear** in the project card when an `images` array is present.

### Alternative: Manual SQL Import

Or use the SQL Editor to bulk import manually:

```sql
INSERT INTO projects (title, description, image, technologies, github, demo, featured, macos_window, confidential, classification, roles, development_status, development_timeline, display_order)
VALUES 
  ('Spexop-UI', 'Complete React component ecosystem...', 'https://images.unsplash.com/...', ARRAY['React', 'TypeScript'], 'https://github.com/...', 'https://spexop.com', true, true, false, NULL, ARRAY[], NULL, NULL, 1),
  -- Add more projects...
;
```

## Security

- Admin panel requires authentication
- Only authenticated users can modify projects
- Public portfolio can only read active projects
- RLS (Row Level Security) policies enforce access control

## File Structure

```bash
admin/
├── index.html          # Admin panel interface
├── admin.css          # Admin panel styles
├── admin.js           # Admin panel logic
├── supabase-config.js # Supabase configuration
└── README.md          # This file
```

## Troubleshooting

### Can't log in

- Verify your user exists in Supabase Authentication
- Check browser console for errors
- Ensure RLS policies are set correctly

### Projects not showing

- Check that `active = true` for projects you want to display
- Verify Supabase URL and keys are correct
- Check browser console for API errors

### Changes not saving

- Ensure you're authenticated
- Check that RLS policies allow authenticated users to modify
- Verify all required fields are filled
