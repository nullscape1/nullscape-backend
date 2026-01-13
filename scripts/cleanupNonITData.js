/**
 * Cleanup Script - Remove Non-IT Related Data
 * This script removes data that is not related to IT/software development
 * 
 * Usage: node scripts/cleanupNonITData.js [email] [password]
 */

import dotenv from 'dotenv';
import https from 'https';
import http from 'http';

dotenv.config();

const API_BASE = process.env.API_BASE_URL || 'http://localhost:4000/api/v1';
const ADMIN_EMAIL = process.argv[2] || process.env.ADMIN_EMAIL || 'admin@nullscape.com';
const ADMIN_PASSWORD = process.argv[3] || process.env.ADMIN_PASSWORD || 'admin123';

let authToken = '';

// Non-IT keywords to identify data that should be removed
const nonITKeywords = [
  'restaurant', 'food', 'cooking', 'recipe', 'hotel', 'travel', 'tourism',
  'fashion', 'clothing', 'retail', 'shopping', 'beauty', 'cosmetic',
  'real estate', 'property', 'construction', 'architecture',
  'healthcare', 'medical', 'hospital', 'pharmacy', 'dental',
  'education', 'school', 'university', 'course', 'training',
  'fitness', 'gym', 'yoga', 'sports', 'entertainment', 'music',
  'automotive', 'car', 'vehicle', 'insurance', 'finance', 'banking',
  'agriculture', 'farming', 'pet', 'animal', 'non-profit', 'charity'
];

function makeRequest(url, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };
    
    if (requestHeaders.Authorization) {
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
    
    authToken = response.data.tokens?.accessToken || response.data.accessToken;
    
    if (!authToken) {
      console.error('❌ No access token in login response');
      return false;
    }
    
    console.log('✅ Login successful!\n');
    return true;
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
    console.error('❌ Login failed:', errorMsg);
    return false;
  }
}

function isNonIT(text) {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return nonITKeywords.some(keyword => lowerText.includes(keyword));
}

async function deleteItem(endpoint, id, name) {
  try {
    await makeRequest(
      `${API_BASE}${endpoint}/${id}`,
      'DELETE',
      null,
      { Authorization: authToken }
    );
    console.log(`  ✅ Deleted: ${name}`);
    return true;
  } catch (error) {
    console.error(`  ❌ Failed to delete ${name}:`, error.response?.data?.message || error.message);
    return false;
  }
}

async function cleanupData() {
  console.log('🧹 Starting cleanup of non-IT related data...\n');

  const loggedIn = await login();
  if (!loggedIn) {
    console.error('❌ Cannot proceed without authentication');
    process.exit(1);
  }

  let deletedCount = 0;

  // Cleanup Services
  try {
    console.log('📦 Checking services...');
    const response = await makeRequest(
      `${API_BASE}/services?limit=1000`,
      'GET',
      null,
      { Authorization: authToken }
    );
    
    const services = response.data?.data || response.data || [];
    for (const service of services) {
      if (isNonIT(service.name) || isNonIT(service.description)) {
        await deleteItem('/services', service._id, `Service: ${service.name}`);
        deletedCount++;
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  } catch (error) {
    console.error('  ⚠️  Error checking services:', error.message);
  }

  // Cleanup Service Categories
  try {
    console.log('\n📁 Checking service categories...');
    const response = await makeRequest(
      `${API_BASE}/service-categories?limit=1000`,
      'GET',
      null,
      { Authorization: authToken }
    );
    
    const categories = response.data?.data || response.data || [];
    for (const category of categories) {
      if (isNonIT(category.name) || isNonIT(category.description)) {
        await deleteItem('/service-categories', category._id, `Category: ${category.name}`);
        deletedCount++;
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  } catch (error) {
    console.error('  ⚠️  Error checking service categories:', error.message);
  }

  // Cleanup Portfolio Projects
  try {
    console.log('\n💼 Checking portfolio projects...');
    const response = await makeRequest(
      `${API_BASE}/portfolio?limit=1000`,
      'GET',
      null,
      { Authorization: authToken }
    );
    
    const projects = response.data?.data || response.data || [];
    for (const project of projects) {
      if (isNonIT(project.name) || isNonIT(project.description) || isNonIT(project.clientName)) {
        await deleteItem('/portfolio', project._id, `Portfolio: ${project.name}`);
        deletedCount++;
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  } catch (error) {
    console.error('  ⚠️  Error checking portfolio:', error.message);
  }

  // Cleanup Blog Posts
  try {
    console.log('\n📝 Checking blog posts...');
    const response = await makeRequest(
      `${API_BASE}/blog?limit=1000`,
      'GET',
      null,
      { Authorization: authToken }
    );
    
    const posts = response.data?.data || response.data || [];
    for (const post of posts) {
      if (isNonIT(post.title) || isNonIT(post.description) || isNonIT(post.contentHtml)) {
        await deleteItem('/blog', post._id, `Blog: ${post.title}`);
        deletedCount++;
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  } catch (error) {
    console.error('  ⚠️  Error checking blog posts:', error.message);
  }

  // Cleanup Testimonials
  try {
    console.log('\n💬 Checking testimonials...');
    const response = await makeRequest(
      `${API_BASE}/testimonials?limit=1000`,
      'GET',
      null,
      { Authorization: authToken }
    );
    
    const testimonials = response.data?.data || response.data || [];
    for (const testimonial of testimonials) {
      if (isNonIT(testimonial.clientName) || isNonIT(testimonial.review)) {
        await deleteItem('/testimonials', testimonial._id, `Testimonial: ${testimonial.clientName}`);
        deletedCount++;
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  } catch (error) {
    console.error('  ⚠️  Error checking testimonials:', error.message);
  }

  console.log(`\n✨ Cleanup completed! Deleted ${deletedCount} non-IT related items.`);
}

cleanupData().catch((error) => {
  console.error('❌ Cleanup failed:', error);
  process.exit(1);
});

