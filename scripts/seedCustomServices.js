/**
 * Seed script for Custom Software Development Services
 * Run this script to populate the database with dummy data
 * 
 * Usage: node scripts/seedCustomServices.js
 * 
 * Make sure you have:
 * 1. A valid admin user account
 * 2. Backend server running
 * 3. Environment variables set (API_BASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD)
 */

import dotenv from 'dotenv';
import https from 'https';
import http from 'http';

dotenv.config();

// Get credentials from environment variables or command line arguments
const API_BASE = process.env.API_BASE_URL || 'http://localhost:4000/api/v1';
const ADMIN_EMAIL = process.argv[2] || process.env.ADMIN_EMAIL || 'admin@nullscape.com';
const ADMIN_PASSWORD = process.argv[3] || process.env.ADMIN_PASSWORD || 'admin123';

console.log('📋 Configuration:');
console.log(`   API Base: ${API_BASE}`);
console.log(`   Admin Email: ${ADMIN_EMAIL}`);
console.log(`   Password: ${'*'.repeat(ADMIN_PASSWORD.length)}`);
console.log('');

// Service Categories from the image
const serviceCategories = [
  { name: 'AI & ML', order: 0, description: 'Artificial Intelligence and Machine Learning services' },
  { name: 'Cloud Computing', order: 1, description: 'Cloud infrastructure and computing solutions' },
  { name: 'Custom SW Solutions', order: 2, description: 'Custom software development solutions' },
  { name: 'Data Engineering', order: 3, description: 'Data processing and engineering services' },
  { name: 'Digital Commerce', order: 4, description: 'E-commerce and digital commerce platforms' },
  { name: 'Mobile App Development', order: 5, description: 'Mobile application development services' },
  { name: 'Product Engineering', order: 6, description: 'Product engineering and development' },
  { name: 'SW Testing & QA', order: 7, description: 'Software testing and quality assurance' },
];

// Services for AI & ML category (from the image)
const aiMlServices = [
  {
    name: 'Generative AI',
    description: 'AI-driven creativity for content, design, and idea generation through AI and ML development services and custom AI solutions development.',
    icon: '',
    order: 0,
  },
  {
    name: 'Computer Vision',
    description: 'Transforming visual data into actionable insights through image and video analysis.',
    icon: '',
    order: 1,
  },
  {
    name: 'Machine Learning',
    description: 'Intelligent systems that learn from data to automate tasks and predict trends.',
    icon: '',
    order: 2,
  },
  {
    name: 'LLM Integration',
    description: 'Enhancing user interactions with large language models for intuitive, human-like communication.',
    icon: '',
    order: 3,
  },
  {
    name: 'MLOps',
    description: 'Streamlined deployment and optimization offered in custom AI solutions development.',
    icon: '',
    order: 4,
  },
  {
    name: 'Deep Learning Solutions',
    description: 'Advanced pattern recognition and decision-making for solving complex problems.',
    icon: '',
    order: 5,
  },
];

// Additional sample services for other categories
const sampleServices = {
  'Cloud Computing': [
    { name: 'AWS Solutions', description: 'Amazon Web Services cloud infrastructure and deployment.', order: 0 },
    { name: 'Azure Services', description: 'Microsoft Azure cloud platform integration and management.', order: 1 },
    { name: 'Google Cloud', description: 'Google Cloud Platform services and solutions.', order: 2 },
    { name: 'DevOps & CI/CD', description: 'Continuous integration and deployment pipelines.', order: 3 },
  ],
  'Custom SW Solutions': [
    { name: 'Enterprise Software', description: 'Custom enterprise software solutions tailored to your business.', order: 0 },
    { name: 'API Development', description: 'RESTful and GraphQL API design and development.', order: 1 },
    { name: 'Microservices Architecture', description: 'Scalable microservices-based application development.', order: 2 },
  ],
  'Data Engineering': [
    { name: 'Data Pipelines', description: 'Building efficient data processing and transformation pipelines.', order: 0 },
    { name: 'Big Data Solutions', description: 'Handling and processing large-scale data sets.', order: 1 },
    { name: 'Data Warehousing', description: 'Data warehouse design and implementation.', order: 2 },
  ],
  'Digital Commerce': [
    { name: 'E-commerce Platforms', description: 'Custom e-commerce website and platform development.', order: 0 },
    { name: 'Payment Integration', description: 'Secure payment gateway integration and management.', order: 1 },
    { name: 'Marketplace Solutions', description: 'Multi-vendor marketplace platform development.', order: 2 },
  ],
  'Mobile App Development': [
    { name: 'iOS Development', description: 'Native iOS application development with Swift.', order: 0 },
    { name: 'Android Development', description: 'Native Android application development with Kotlin.', order: 1 },
    { name: 'React Native', description: 'Cross-platform mobile app development with React Native.', order: 2 },
    { name: 'Flutter Apps', description: 'Cross-platform mobile apps using Flutter framework.', order: 3 },
  ],
  'Product Engineering': [
    { name: 'MVP Development', description: 'Minimum viable product development and launch.', order: 0 },
    { name: 'Product Strategy', description: 'Product planning and strategy consulting.', order: 1 },
    { name: 'Technical Architecture', description: 'System architecture design and implementation.', order: 2 },
  ],
  'SW Testing & QA': [
    { name: 'Automated Testing', description: 'Automated test suite development and execution.', order: 0 },
    { name: 'Performance Testing', description: 'Load testing and performance optimization.', order: 1 },
    { name: 'Security Testing', description: 'Security vulnerability assessment and testing.', order: 2 },
  ],
};

let authToken = '';

function makeRequest(url, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };
    
    // Ensure Authorization header is properly formatted
    if (requestHeaders.Authorization) {
      // Remove any existing "Bearer " prefix to avoid duplication
      const token = requestHeaders.Authorization.replace(/^Bearer\s+/i, '');
      requestHeaders.Authorization = `Bearer ${token}`;
    }
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: requestHeaders,
    };

    const req = client.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ data: parsed, status: res.statusCode });
          } else {
            reject({ response: { data: parsed, status: res.statusCode }, status: res.statusCode });
          }
        } catch (e) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ data: body, status: res.statusCode });
          } else {
            reject({ response: { data: body, status: res.statusCode }, status: res.statusCode });
          }
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function login() {
  try {
    console.log('🔐 Logging in as admin...');
    const response = await makeRequest(`${API_BASE}/auth/login`, 'POST', {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    
    // The login response has { user, tokens: { accessToken, refreshToken } }
    authToken = response.data.tokens?.accessToken || response.data.accessToken;
    
    if (!authToken) {
      console.error('❌ No access token in login response');
      console.error('Response structure:', JSON.stringify(response.data, null, 2));
      return false;
    }
    
    console.log('✅ Login successful!');
    console.log(`🔑 Token extracted: ${authToken.substring(0, 30)}...\n`);
    return true;
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
    console.error('❌ Login failed:', errorMsg);
    if (error.response?.data) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
    console.error('\n💡 Tips:');
    console.error('   1. Make sure the backend server is running');
    console.error('   2. Verify your admin credentials are correct');
    console.error('   3. You can pass credentials as arguments:');
    console.error('      node scripts/seedCustomServices.js your-email@example.com your-password');
    console.error('   4. Or set environment variables:');
    console.error('      ADMIN_EMAIL=your-email@example.com ADMIN_PASSWORD=your-password node scripts/seedCustomServices.js');
    return false;
  }
}

async function createCategory(category) {
  try {
    if (!authToken) {
      console.error(`  ❌ No auth token available for category ${category.name}`);
      return null;
    }
    
    const response = await makeRequest(
      `${API_BASE}/service-categories`,
      'POST',
      {
        name: category.name,
        description: category.description,
        order: category.order,
        status: 'active',
      },
      { Authorization: authToken }
    );
    console.log(`  ✅ Created category: ${category.name}`);
    return response.data;
  } catch (error) {
    if (error.status === 409) {
      console.log(`  ⚠️  Category already exists: ${category.name}`);
      return null;
    }
    const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
    console.error(`  ❌ Failed to create category ${category.name}:`, errorMsg);
    if (errorMsg.includes('token') || errorMsg.includes('unauthorized')) {
      console.error(`     Token might be invalid. Try logging in again.`);
    }
    return null;
  }
}

async function createService(service, categoryName) {
  try {
    if (!authToken) {
      console.error(`    ❌ No auth token available for service ${service.name}`);
      return null;
    }
    
    const response = await makeRequest(
      `${API_BASE}/services`,
      'POST',
      {
        name: service.name,
        description: service.description,
        icon: service.icon || '',
        category: categoryName,
        order: service.order,
        status: 'active',
      },
      { Authorization: authToken }
    );
    console.log(`    ✅ Created service: ${service.name}`);
    return response.data;
  } catch (error) {
    if (error.status === 409) {
      console.log(`    ⚠️  Service already exists: ${service.name}`);
      return null;
    }
    const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
    console.error(`    ❌ Failed to create service ${service.name}:`, errorMsg);
    return null;
  }
}

async function seedData() {
  console.log('🚀 Starting seed process for Custom Software Development Services...\n');

  // Login
  const loggedIn = await login();
  if (!loggedIn) {
    console.error('❌ Cannot proceed without authentication');
    process.exit(1);
  }

  // Create categories
  console.log('📁 Creating service categories...');
  const createdCategories = {};
  
  for (const category of serviceCategories) {
    const created = await createCategory(category);
    if (created) {
      createdCategories[category.name] = created;
    }
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log('\n📦 Creating services...\n');

  // Create AI & ML services
  if (createdCategories['AI & ML']) {
    console.log('🤖 Creating AI & ML services...');
    for (const service of aiMlServices) {
      await createService(service, 'AI & ML');
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    console.log('');
  }

  // Create services for other categories
  for (const [categoryName, services] of Object.entries(sampleServices)) {
    if (createdCategories[categoryName]) {
      console.log(`📱 Creating ${categoryName} services...`);
      for (const service of services) {
        await createService(service, categoryName);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      console.log('');
    }
  }

  console.log('✨ Seed process completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Categories created: ${Object.keys(createdCategories).length}`);
  console.log(`   - Total services created: ${aiMlServices.length + Object.values(sampleServices).flat().length}`);
  console.log('\n🎉 You can now view the services in the admin panel and on the website!');
}

// Run the seed script
seedData().catch((error) => {
  console.error('❌ Seed process failed:', error);
  process.exit(1);
});

