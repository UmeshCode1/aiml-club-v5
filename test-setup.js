const fs = require('fs');
const path = require('path');

console.log('═══════════════════════════════════════════════════════════');
console.log('🔍 AIML Club Setup Verification');
console.log('═══════════════════════════════════════════════════════════\n');

let issuesFound = 0;

// Check .env.local
console.log('📋 Checking Configuration...');
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const env = fs.readFileSync(envPath, 'utf-8');
  const hasTBD = env.includes('=TBD');
  console.log('  ✅ .env.local exists');
  if (hasTBD) {
    console.log('  ❌ Still has TBD values - setup not complete');
    issuesFound++;
  } else {
    console.log('  ✅ All collection IDs configured');
  }
  
  // Check for required IDs
  const requiredVars = [
    'NEXT_PUBLIC_APPWRITE_ENDPOINT',
    'NEXT_PUBLIC_APPWRITE_PROJECT_ID',
    'NEXT_PUBLIC_APPWRITE_DATABASE_ID',
    'APPWRITE_API_KEY'
  ];
  
  requiredVars.forEach(varName => {
    if (!env.includes(varName + '=')) {
      console.log(`  ❌ Missing: ${varName}`);
      issuesFound++;
    }
  });
} else {
  console.log('  ❌ .env.local not found');
  issuesFound++;
}

// Check API routes
console.log('\n📡 Checking API Routes...');
const highlightsApi = path.join(__dirname, 'app', 'api', 'highlights', 'route.ts');
if (fs.existsSync(highlightsApi)) {
  console.log('  ✅ Highlights API exists');
} else {
  console.log('  ❌ Highlights API missing');
  console.log('     Fix: Run node scripts/createMissingFiles.js');
  issuesFound++;
}

const eventsApi = path.join(__dirname, 'app', 'api', 'events', 'route.ts');
console.log(fs.existsSync(eventsApi) ? '  ✅ Events API exists' : '  ❌ Events API missing');

// Check admin files
console.log('\n👤 Checking Admin Panel...');
const adminLayout = path.join(__dirname, 'app', 'admin', 'layout.tsx');
if (fs.existsSync(adminLayout)) {
  console.log('  ✅ Admin layout exists');
} else {
  console.log('  ❌ Admin layout missing');
  issuesFound++;
}

const adminPage = path.join(__dirname, 'app', 'admin', 'page.tsx');
console.log(fs.existsSync(adminPage) ? '  ✅ Admin dashboard exists' : '  ❌ Admin dashboard missing');

// Check notifications page
const notificationsPage = path.join(__dirname, 'app', 'admin', 'notifications', 'page.tsx');
if (fs.existsSync(notificationsPage)) {
  console.log('  ✅ Notifications page exists');
} else {
  console.log('  ❌ Notifications page missing');
  console.log('     Fix: Run node scripts/createAdminPages.js');
  issuesFound++;
}

// Check dependencies
console.log('\n📦 Checking Dependencies...');
const nodeModules = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModules)) {
  console.log('  ✅ Dependencies installed');
  
  // Check for specific important packages
  const checkPackage = (pkg) => {
    const pkgPath = path.join(__dirname, 'node_modules', pkg);
    return fs.existsSync(pkgPath);
  };
  
  if (!checkPackage('next')) {
    console.log('  ❌ Next.js not installed');
    issuesFound++;
  }
  if (!checkPackage('appwrite')) {
    console.log('  ❌ Appwrite SDK not installed');
    issuesFound++;
  }
  if (!checkPackage('react')) {
    console.log('  ❌ React not installed');
    issuesFound++;
  }
} else {
  console.log('  ❌ Dependencies not installed');
  console.log('     Fix: Run npm install');
  issuesFound++;
}

// Check build folder
console.log('\n🔨 Checking Build...');
const nextFolder = path.join(__dirname, '.next');
if (fs.existsSync(nextFolder)) {
  console.log('  ✅ .next folder exists (site was built)');
} else {
  console.log('  ℹ️  .next folder not found (run npm run dev to build)');
}

// Summary
console.log('\n═══════════════════════════════════════════════════════════');
console.log('📊 Summary:');
console.log('═══════════════════════════════════════════════════════════');

if (issuesFound === 0) {
  console.log('✅ Everything looks good!');
  console.log('\n🚀 Next steps:');
  console.log('   1. Run: npm run dev');
  console.log('   2. Open: http://localhost:3000');
  console.log('   3. Test admin: http://localhost:3000/admin');
} else {
  console.log(`❌ Found ${issuesFound} issue(s) that need fixing.`);
  console.log('\n🔧 Quick fixes:');
  console.log('   1. Run: npm install');
  console.log('   2. Run: node scripts/createMissingFiles.js');
  console.log('   3. Run: node scripts/createAdminPages.js');
  console.log('   4. Run: npm run dev');
  console.log('\nOr run all at once:');
  console.log('   npm run setup:complete');
}

console.log('\n═══════════════════════════════════════════════════════════\n');

// Exit with status code
process.exit(issuesFound > 0 ? 1 : 0);
