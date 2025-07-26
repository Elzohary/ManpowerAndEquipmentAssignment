# Vercel + Supabase Deployment Guide

## 🚀 Deployment Architecture

**Frontend**: Vercel (React + Vite)  
**Backend**: Supabase (PostgreSQL + APIs)  
**CDN**: Vercel Edge Network  

This is the **optimal setup** for modern web applications!

## 📋 Prerequisites

1. **Supabase Account**: [supabase.com](https://supabase.com)
2. **Vercel Account**: [vercel.com](https://vercel.com)
3. **GitHub Repository**: Your code should be in a GitHub repo

## 🔧 Step 1: Setup Supabase

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose organization and set project name
   - Set database password
   - Choose region (closest to your users)

2. **Get Credentials**:
   - Go to Settings → API
   - Copy `Project URL` and `anon public` key

3. **Setup Database**:
   - Go to SQL Editor
   - Run the schema from `database/schema.sql`

## 🚀 Step 2: Deploy to Vercel

### Option A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Set environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Redeploy with environment variables
vercel --prod
```

### Option B: Vercel Dashboard

1. **Connect Repository**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Add Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add:
     - `VITE_SUPABASE_URL` = Your Supabase Project URL
     - `VITE_SUPABASE_ANON_KEY` = Your Supabase Anon Key

4. **Deploy**:
   - Click "Deploy"
   - Your app will be live in ~2 minutes!

## 🔒 Step 3: Security Setup

### Supabase RLS (Row Level Security)

```sql
-- Enable RLS on all tables
ALTER TABLE job_titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Create policies (example for authenticated users)
CREATE POLICY "Users can view all job_titles" ON job_titles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert job_titles" ON job_titles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

### Vercel Security Headers

Add to `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## 🌐 Step 4: Custom Domain (Optional)

1. **Add Domain in Vercel**:
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **SSL Certificate**:
   - Automatically provided by Vercel
   - No additional configuration needed

## 📊 Step 5: Monitoring & Analytics

### Vercel Analytics
```bash
npm install @vercel/analytics
```

Add to your `main.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

// Add <Analytics /> to your app
```

### Supabase Monitoring
- Built-in dashboard at supabase.com
- Real-time database metrics
- API usage statistics

## 🔄 Step 6: Continuous Deployment

**Automatic Deployments**:
- Push to `main` branch → Auto-deploy to production
- Push to other branches → Auto-deploy preview URLs
- Pull requests → Auto-deploy preview URLs

## 💡 Pro Tips

1. **Environment Variables**:
   - Use Vercel's environment variable management
   - Different values for preview/production
   - Secure by default

2. **Performance**:
   - Vercel Edge Network (global CDN)
   - Automatic image optimization
   - Built-in performance monitoring

3. **Database**:
   - Supabase handles scaling automatically
   - Built-in connection pooling
   - Real-time subscriptions available

4. **Cost Optimization**:
   - Vercel: Free tier for personal projects
   - Supabase: Free tier with 500MB database
   - Pay-as-you-scale pricing

## 🚨 Troubleshooting

### Common Issues:

1. **Build Fails**:
   ```bash
   # Check build locally
   npm run build
   
   # Check TypeScript
   npx tsc --noEmit
   ```

2. **Environment Variables Not Working**:
   - Ensure variables start with `VITE_`
   - Redeploy after adding variables
   - Check Vercel dashboard for correct values

3. **Database Connection Issues**:
   - Verify Supabase URL and key
   - Check RLS policies
   - Ensure database is not paused

## 📈 Scaling Considerations

**When to Upgrade**:
- **Vercel Pro**: Custom domains, more build minutes
- **Supabase Pro**: Larger database, more API requests
- **CDN**: Global edge locations for better performance

This setup scales from prototype to enterprise! 🚀