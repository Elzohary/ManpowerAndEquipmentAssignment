#!/usr/bin/env node

/**
 * Deployment Verification Script
 * This script checks if the project is ready for deployment to Vercel with Supabase
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log('🔍 Vercel + Supabase Deployment Verification\n');

// Check if required files exist
const requiredFiles = [
  'vercel.json',
  'package.json',
  'database/schema.sql',
  'lib/supabase.ts',
  'lib/database.ts',
  '.env'
];

console.log('📁 Checking required files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  if (existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

// Check package.json for required dependencies
console.log('\n📦 Checking dependencies...');
try {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
  const requiredDeps = ['@supabase/supabase-js', 'react', 'vite'];
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]) {
      console.log(`✅ ${dep}`);
    } else {
      console.log(`❌ ${dep} - MISSING`);
      allFilesExist = false;
    }
  });
} catch (error) {
  console.log('❌ Error reading package.json');
  allFilesExist = false;
}

// Check vercel.json configuration
console.log('\n⚙️ Checking Vercel configuration...');
try {
  const vercelConfig = JSON.parse(readFileSync('vercel.json', 'utf8'));
  
  if (vercelConfig.buildCommand) {
    console.log(`✅ Build command: ${vercelConfig.buildCommand}`);
  } else {
    console.log('⚠️ No build command specified');
  }
  
  if (vercelConfig.outputDirectory) {
    console.log(`✅ Output directory: ${vercelConfig.outputDirectory}`);
  } else {
    console.log('⚠️ No output directory specified');
  }
} catch (error) {
  console.log('❌ Error reading vercel.json');
}

// Check environment variables
console.log('\n🔐 Checking environment variables...');
try {
  const envContent = readFileSync('.env', 'utf8');
  
  if (envContent.includes('VITE_SUPABASE_URL')) {
    const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/);
    const url = urlMatch?.[1]?.trim();
    if (url && !url.includes('placeholder') && !url.includes('your-supabase')) {
      console.log('✅ VITE_SUPABASE_URL is configured');
    } else {
      console.log('⚠️ VITE_SUPABASE_URL needs to be configured with actual Supabase URL');
    }
  } else {
    console.log('❌ VITE_SUPABASE_URL not found in .env');
  }
  
  if (envContent.includes('VITE_SUPABASE_ANON_KEY')) {
    const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/);
    const key = keyMatch?.[1]?.trim();
    if (key && !key.includes('placeholder') && !key.includes('your-supabase')) {
      console.log('✅ VITE_SUPABASE_ANON_KEY is configured');
    } else {
      console.log('⚠️ VITE_SUPABASE_ANON_KEY needs to be configured with actual Supabase key');
    }
  } else {
    console.log('❌ VITE_SUPABASE_ANON_KEY not found in .env');
  }
} catch (error) {
  console.log('❌ Error reading .env file');
}

// Check database schema
console.log('\n🗄️ Checking database schema...');
try {
  const schemaContent = readFileSync('database/schema.sql', 'utf8');
  
  const requiredTables = ['employees', 'job_titles', 'work_groups', 'departments', 'project_types'];
  requiredTables.forEach(table => {
    if (schemaContent.includes(`CREATE TABLE ${table}`)) {
      console.log(`✅ ${table} table defined`);
    } else {
      console.log(`❌ ${table} table missing`);
    }
  });
  
  if (schemaContent.includes('ROW LEVEL SECURITY')) {
    console.log('✅ Row Level Security configured');
  } else {
    console.log('⚠️ Row Level Security not configured');
  }
} catch (error) {
  console.log('❌ Error reading database schema');
}

// Summary
console.log('\n📋 Summary:');
if (allFilesExist) {
  console.log('✅ All required files are present');
} else {
  console.log('❌ Some required files are missing');
}

console.log('\n🚀 Next Steps for Deployment:');
console.log('1. Create a Supabase project at https://supabase.com');
console.log('2. Run the database/schema.sql in your Supabase SQL editor');
console.log('3. Get your Supabase URL and anon key from the project settings');
console.log('4. Update your .env file with the actual credentials');
console.log('5. Deploy to Vercel and add the environment variables in Vercel dashboard');
console.log('6. Test the deployed application');

console.log('\n💡 The application is designed to work with mock data when Supabase is not configured,');
console.log('   so it will function even without proper Supabase credentials.');