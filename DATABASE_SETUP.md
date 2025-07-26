# Database Setup Guide

This guide will help you set up Supabase as the database backend for your Company Dashboard Interface.

## Prerequisites

- A Supabase account (free tier available at https://supabase.com)
- Node.js and npm installed

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign up/log in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `company-dashboard`
   - Database Password: (choose a strong password)
   - Region: (choose closest to your location)
5. Click "Create new project"
6. Wait for the project to be created (usually takes 1-2 minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to Settings → API
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **Anon public key** (under "Project API keys")

## Step 3: Set Up Environment Variables

1. In your project root directory, create a `.env` file
2. Copy the contents from `.env.example` and fill in your values:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Important:** Never commit your `.env` file to version control. It's already included in `.gitignore`.

## Step 4: Set Up the Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Copy the entire contents of `database/schema.sql`
3. Paste it into the SQL Editor
4. Click "Run" to execute the schema

This will create:
- All necessary tables (job_titles, work_groups, departments, project_types, employees)
- Indexes for better performance
- Sample data to get you started
- Row Level Security (RLS) policies

## Step 5: Test the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the Master Data page
3. You should see the sample data loaded from your Supabase database
4. Try adding, editing, or deleting items to test the functionality

## Step 6: Authentication (Optional)

The current setup works with anonymous access for development. For production, you'll want to:

1. Enable authentication in Supabase
2. Set up user registration/login
3. Update RLS policies to be user-specific

## Troubleshooting

### Connection Issues
- Verify your environment variables are correct
- Check that your Supabase project is active
- Ensure you're using the correct URL and key

### Permission Errors
- Make sure RLS policies are set up correctly
- Check that the anon key has the right permissions

### Data Not Loading
- Check the browser console for error messages
- Verify the database schema was created successfully
- Test the connection in Supabase's API docs

## Next Steps

1. **Authentication**: Set up user authentication for production use
2. **Validation**: Add form validation and error handling
3. **Relationships**: Implement foreign key relationships between tables
4. **Real-time**: Enable real-time subscriptions for live updates
5. **Backup**: Set up automated database backups

## Support

- Supabase Documentation: https://supabase.com/docs
- Supabase Community: https://github.com/supabase/supabase/discussions
- Project Issues: Create an issue in your repository

---

Your Company Dashboard Interface is now connected to a live database! 🎉