const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const config = require('../app/config/app.json');

// Load environment variables from .env.local for development
function loadEnvLocal() {
  const envLocalPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envLocalPath)) {
    const envContent = fs.readFileSync(envLocalPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && !key.startsWith('#') && valueParts.length > 0) {
        const value = valueParts.join('=').replace(/^["']|["']$/g, '');
        if (value) {
          process.env[key.trim()] = value.trim();
        }
      }
    });
    console.log('📁 Loaded local development environment variables\n');
  }
}

// Function to run commands and handle errors
function runCommand(command, description, env = {}) {
  try {
    console.log(`🔄 ${description}...`);
    execSync(command, { 
      stdio: 'inherit', 
      cwd: process.cwd(),
      env: { ...process.env, ...env }
    });
    console.log(`✅ ${description} completed\n`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    process.exit(1);
  }
}

// Function to check if Docker is running
function isDockerRunning() {
  try {
    execSync('docker info', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

// Function to check if database container is running
function isDatabaseRunning() {
  try {
    const output = execSync('docker-compose ps --services --filter="status=running"', { 
      encoding: 'utf8', 
      cwd: process.cwd(),
      env: process.env
    });
    return output.includes('db');
  } catch {
    return false;
  }
}

console.log('🚀 Starting development environment...\n');

// Load local environment variables first
loadEnvLocal();

// Check if Docker is running
if (!isDockerRunning()) {
  console.error('❌ Docker is not running. Please start Docker and try again.');
  process.exit(1);
}

// Start database if not running
if (!isDatabaseRunning()) {
  runCommand('docker-compose up -d db', 'Starting PostgreSQL database');
  
  // Wait for database to be ready
  console.log('⏳ Waiting for database to be ready...');
  let retries = 0;
  const maxRetries = 30;
  
  while (retries < maxRetries) {
    try {
      execSync('docker-compose exec -T db pg_isready -h localhost -p 5432 -U postgres', { 
        stdio: 'pipe',
        env: process.env
      });
      console.log('✅ Database is ready!\n');
      break;
    } catch {
      retries++;
      if (retries >= maxRetries) {
        console.error('❌ Database failed to start within timeout period');
        process.exit(1);
      }
      // Wait 1 second before next retry
      execSync('sleep 1', { stdio: 'pipe' });
    }
  }
} else {
  console.log('✅ Database is already running\n');
}

// Generate Prisma client with local env
runCommand('prisma generate', 'Generating Prisma client');

// Apply database migrations with local env
runCommand('prisma migrate deploy', 'Applying database migrations');

console.log('🎉 Development environment ready! Starting Remix...\n');

// Pop a lil' monogram in the terminal
console.info(config.ascii);
