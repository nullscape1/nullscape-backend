/**
 * Comprehensive Seed Script for IT Website Data
 * This script populates the database with all IT-related content for production
 * and removes any non-IT related data
 * 
 * Usage: node scripts/seedITWebsiteData.js [email] [password]
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

let authToken = '';

// ============================================================================
// DATA DEFINITIONS - IT RELATED CONTENT
// ============================================================================

// Service Categories (IT focused)
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

// Services
const services = {
  'AI & ML': [
    { name: 'Generative AI', description: 'AI-driven creativity for content, design, and idea generation through AI and ML development services and custom AI solutions development.', order: 0 },
    { name: 'Computer Vision', description: 'Transforming visual data into actionable insights through image and video analysis.', order: 1 },
    { name: 'Machine Learning', description: 'Intelligent systems that learn from data to automate tasks and predict trends.', order: 2 },
    { name: 'LLM Integration', description: 'Enhancing user interactions with large language models for intuitive, human-like communication.', order: 3 },
    { name: 'MLOps', description: 'Streamlined deployment and optimization offered in custom AI solutions development.', order: 4 },
    { name: 'Deep Learning Solutions', description: 'Advanced pattern recognition and decision-making for solving complex problems.', order: 5 },
  ],
  'Cloud Computing': [
    { name: 'AWS Solutions', description: 'Amazon Web Services cloud infrastructure and deployment.', order: 0 },
    { name: 'Azure Services', description: 'Microsoft Azure cloud platform integration and management.', order: 1 },
    { name: 'Google Cloud', description: 'Google Cloud Platform services and solutions.', order: 2 },
    { name: 'DevOps & CI/CD', description: 'Continuous integration and deployment pipelines.', order: 3 },
    { name: 'Cloud Migration', description: 'Seamless migration of applications and data to the cloud.', order: 4 },
  ],
  'Custom SW Solutions': [
    { name: 'Enterprise Software', description: 'Custom enterprise software solutions tailored to your business.', order: 0 },
    { name: 'API Development', description: 'RESTful and GraphQL API design and development.', order: 1 },
    { name: 'Microservices Architecture', description: 'Scalable microservices-based application development.', order: 2 },
    { name: 'Legacy System Modernization', description: 'Modernizing legacy systems with modern technologies.', order: 3 },
  ],
  'Data Engineering': [
    { name: 'Data Pipelines', description: 'Building efficient data processing and transformation pipelines.', order: 0 },
    { name: 'Big Data Solutions', description: 'Handling and processing large-scale data sets.', order: 1 },
    { name: 'Data Warehousing', description: 'Data warehouse design and implementation.', order: 2 },
    { name: 'Business Intelligence', description: 'BI tools and dashboards for data-driven decisions.', order: 3 },
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

// Portfolio Categories
const portfolioCategories = [
  { name: 'Web Applications', description: 'Custom web applications and platforms', order: 0 },
  { name: 'Mobile Apps', description: 'iOS and Android mobile applications', order: 1 },
  { name: 'AI/ML Projects', description: 'Artificial Intelligence and Machine Learning solutions', order: 2 },
  { name: 'E-commerce', description: 'E-commerce platforms and marketplaces', order: 3 },
  { name: 'Enterprise Solutions', description: 'Enterprise software and systems', order: 4 },
];

// Portfolio Projects
const portfolioProjects = [
  {
    name: 'AI-Powered Analytics Platform',
    category: 'AI/ML Projects',
    clientName: 'TechCorp Inc.',
    timeline: '6 months',
    problem: 'Client needed advanced analytics to process millions of data points in real-time.',
    solution: 'Built a scalable AI platform using machine learning algorithms for predictive analytics and real-time insights.',
    description: '<p>An enterprise-grade AI analytics platform that processes millions of data points in real-time, providing actionable insights and predictive analytics for business decision-making.</p>',
    techStack: ['Python', 'TensorFlow', 'React', 'Node.js', 'MongoDB', 'AWS'],
    featured: true,
  },
  {
    name: 'E-commerce Marketplace',
    category: 'E-commerce',
    clientName: 'ShopGlobal',
    timeline: '8 months',
    problem: 'Needed a scalable multi-vendor marketplace platform.',
    solution: 'Developed a full-featured marketplace with vendor management, payment processing, and inventory management.',
    description: '<p>A comprehensive multi-vendor e-commerce marketplace supporting thousands of vendors with advanced search, filtering, and recommendation systems.</p>',
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Stripe API'],
    featured: true,
  },
  {
    name: 'Healthcare Mobile App',
    category: 'Mobile Apps',
    clientName: 'HealthCare Plus',
    timeline: '5 months',
    problem: 'Required a secure mobile app for patient management and telemedicine.',
    solution: 'Created a HIPAA-compliant mobile application with video consultation, appointment scheduling, and prescription management.',
    description: '<p>A secure healthcare mobile application enabling telemedicine consultations, appointment scheduling, and digital prescription management with full HIPAA compliance.</p>',
    techStack: ['React Native', 'Node.js', 'MongoDB', 'WebRTC', 'AWS'],
    featured: true,
  },
  {
    name: 'Cloud Migration Project',
    category: 'Enterprise Solutions',
    clientName: 'FinanceCorp',
    timeline: '10 months',
    problem: 'Legacy system needed migration to cloud infrastructure.',
    solution: 'Migrated entire infrastructure to AWS with zero downtime, improving scalability and reducing costs by 40%.',
    description: '<p>Successfully migrated legacy enterprise systems to AWS cloud infrastructure with zero downtime, achieving 40% cost reduction and improved scalability.</p>',
    techStack: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Python'],
    featured: false,
  },
  {
    name: 'Real-time Collaboration Tool',
    category: 'Web Applications',
    clientName: 'TeamSync',
    timeline: '7 months',
    problem: 'Teams needed a real-time collaboration platform.',
    solution: 'Built a real-time collaboration tool with video conferencing, document sharing, and project management.',
    description: '<p>A comprehensive real-time collaboration platform featuring video conferencing, document sharing, and integrated project management tools.</p>',
    techStack: ['React', 'Node.js', 'WebSocket', 'PostgreSQL', 'Redis'],
    featured: false,
  },
  {
    name: 'IoT Fleet Management System',
    category: 'Enterprise Solutions',
    clientName: 'LogisticsPro',
    timeline: '9 months',
    problem: 'Needed real-time tracking and management of vehicle fleet.',
    solution: 'Developed an IoT-based fleet management system with GPS tracking, route optimization, and maintenance scheduling.',
    description: '<p>An IoT-powered fleet management system providing real-time GPS tracking, route optimization, and predictive maintenance scheduling.</p>',
    techStack: ['React', 'Node.js', 'MongoDB', 'IoT Sensors', 'AWS IoT'],
    featured: false,
  },
];

// Blog Categories
const blogCategories = [
  { name: 'Technology', description: 'Latest technology trends and innovations', order: 0, color: '#005CFF' },
  { name: 'AI & Machine Learning', description: 'AI and ML insights and tutorials', order: 1, color: '#FF6B6B' },
  { name: 'Development', description: 'Software development best practices', order: 2, color: '#4ECDC4' },
  { name: 'Cloud Computing', description: 'Cloud infrastructure and services', order: 3, color: '#45B7D1' },
  { name: 'Mobile Development', description: 'Mobile app development guides', order: 4, color: '#FFA07A' },
];

// Blog Posts
const blogPosts = [
  {
    title: 'The Future of AI in Software Development',
    description: 'Exploring how artificial intelligence is transforming the software development landscape.',
    contentHtml: '<p>Artificial Intelligence is revolutionizing software development, from automated code generation to intelligent testing and deployment. In this article, we explore the latest trends and how AI can enhance your development workflow.</p><p>Key areas include AI-powered code completion, automated testing, and intelligent project management tools that are changing how developers work.</p>',
    category: 'AI & Machine Learning',
    tags: ['AI', 'Machine Learning', 'Software Development', 'Technology'],
    status: 'published',
  },
  {
    title: 'Best Practices for Cloud Migration',
    description: 'A comprehensive guide to migrating your applications to the cloud successfully.',
    contentHtml: '<p>Cloud migration is a critical step for modern businesses. This guide covers best practices, common pitfalls, and strategies for a successful migration.</p><p>We discuss assessment strategies, migration patterns, and post-migration optimization techniques that ensure minimal downtime and maximum efficiency.</p>',
    category: 'Cloud Computing',
    tags: ['Cloud', 'AWS', 'Migration', 'DevOps'],
    status: 'published',
  },
  {
    title: 'Building Scalable Microservices Architecture',
    description: 'Learn how to design and implement scalable microservices for modern applications.',
    contentHtml: '<p>Microservices architecture offers flexibility and scalability for modern applications. This article covers design principles, communication patterns, and deployment strategies.</p><p>We explore service discovery, API gateways, and containerization techniques that make microservices architecture robust and maintainable.</p>',
    category: 'Development',
    tags: ['Microservices', 'Architecture', 'Backend', 'Scalability'],
    status: 'published',
  },
  {
    title: 'React Native vs Flutter: Choosing the Right Framework',
    description: 'A detailed comparison of React Native and Flutter for cross-platform mobile development.',
    contentHtml: '<p>Both React Native and Flutter are popular choices for cross-platform mobile development. This comparison helps you choose the right framework for your project.</p><p>We analyze performance, developer experience, ecosystem, and use cases for each framework to help you make an informed decision.</p>',
    category: 'Mobile Development',
    tags: ['React Native', 'Flutter', 'Mobile Development', 'Cross-platform'],
    status: 'published',
  },
  {
    title: 'DevOps Automation: CI/CD Pipeline Best Practices',
    description: 'Streamline your development workflow with effective CI/CD pipeline implementation.',
    contentHtml: '<p>Continuous Integration and Continuous Deployment are essential for modern software development. Learn how to set up effective CI/CD pipelines.</p><p>This guide covers pipeline design, testing strategies, deployment automation, and monitoring practices that ensure reliable software delivery.</p>',
    category: 'Development',
    tags: ['DevOps', 'CI/CD', 'Automation', 'Best Practices'],
    status: 'published',
  },
];

// Team Members
const teamMembers = [
  {
    name: 'John Smith',
    role: 'Chief Technology Officer',
    description: '20+ years of experience in software architecture and enterprise solutions.',
    social: { linkedin: 'https://linkedin.com/in/johnsmith', github: 'https://github.com/johnsmith' },
    order: 0,
  },
  {
    name: 'Sarah Johnson',
    role: 'Lead AI Engineer',
    description: 'Expert in machine learning and AI solutions with a PhD in Computer Science.',
    social: { linkedin: 'https://linkedin.com/in/sarahjohnson', github: 'https://github.com/sarahjohnson' },
    order: 1,
  },
  {
    name: 'Michael Chen',
    role: 'Senior Full-Stack Developer',
    description: 'Specialized in React, Node.js, and cloud architecture with 10+ years of experience.',
    social: { linkedin: 'https://linkedin.com/in/michaelchen', github: 'https://github.com/michaelchen' },
    order: 2,
  },
  {
    name: 'Emily Davis',
    role: 'DevOps Engineer',
    description: 'Cloud infrastructure and CI/CD pipeline expert with AWS and Azure certifications.',
    social: { linkedin: 'https://linkedin.com/in/emilydavis', github: 'https://github.com/emilydavis' },
    order: 3,
  },
  {
    name: 'David Wilson',
    role: 'Mobile App Developer',
    description: 'iOS and Android specialist with expertise in React Native and Flutter.',
    social: { linkedin: 'https://linkedin.com/in/davidwilson', github: 'https://github.com/davidwilson' },
    order: 4,
  },
];

// Testimonials
const testimonials = [
  {
    clientName: 'TechCorp Inc.',
    review: 'Nullscape delivered an exceptional AI platform that transformed our data analytics capabilities. The team\'s expertise and professionalism were outstanding.',
    rating: 5,
    category: 'AI',
    featured: true,
  },
  {
    clientName: 'ShopGlobal',
    review: 'The e-commerce marketplace they built exceeded our expectations. It\'s scalable, user-friendly, and has significantly increased our sales.',
    rating: 5,
    category: 'Web',
    featured: true,
  },
  {
    clientName: 'HealthCare Plus',
    review: 'Their healthcare mobile app is secure, intuitive, and has improved our patient engagement. Highly recommended for healthcare technology solutions.',
    rating: 5,
    category: 'App',
    featured: true,
  },
  {
    clientName: 'FinanceCorp',
    review: 'The cloud migration was seamless with zero downtime. Their technical expertise and project management were exceptional.',
    rating: 5,
    category: 'Web',
    featured: false,
  },
  {
    clientName: 'TeamSync',
    review: 'The collaboration platform has revolutionized how our teams work together. Great user experience and reliable performance.',
    rating: 5,
    category: 'Web',
    featured: false,
  },
];

// Tech Stack
const techStack = [
  // Frontend
  { name: 'React', category: 'Frontend', description: 'Modern UI library for building interactive user interfaces', order: 0 },
  { name: 'Next.js', category: 'Frontend', description: 'React framework for production-ready applications', order: 1 },
  { name: 'TypeScript', category: 'Frontend', description: 'Typed JavaScript for better code quality', order: 2 },
  { name: 'Vue.js', category: 'Frontend', description: 'Progressive JavaScript framework', order: 3 },
  // Backend
  { name: 'Node.js', category: 'Backend', description: 'JavaScript runtime for server-side development', order: 0 },
  { name: 'Python', category: 'Backend', description: 'Versatile programming language for backend and AI', order: 1 },
  { name: 'Express.js', category: 'Backend', description: 'Fast web framework for Node.js', order: 2 },
  { name: 'Django', category: 'Backend', description: 'High-level Python web framework', order: 3 },
  // Database
  { name: 'MongoDB', category: 'Database', description: 'NoSQL database for flexible data storage', order: 0 },
  { name: 'PostgreSQL', category: 'Database', description: 'Advanced open-source relational database', order: 1 },
  { name: 'Redis', category: 'Database', description: 'In-memory data structure store', order: 2 },
  // Cloud
  { name: 'AWS', category: 'Cloud', description: 'Amazon Web Services cloud platform', order: 0 },
  { name: 'Azure', category: 'Cloud', description: 'Microsoft Azure cloud services', order: 1 },
  { name: 'Google Cloud', category: 'Cloud', description: 'Google Cloud Platform services', order: 2 },
  { name: 'Docker', category: 'DevOps', description: 'Containerization platform', order: 0 },
  { name: 'Kubernetes', category: 'DevOps', description: 'Container orchestration system', order: 1 },
  // Mobile
  { name: 'React Native', category: 'Mobile', description: 'Cross-platform mobile app framework', order: 0 },
  { name: 'Flutter', category: 'Mobile', description: 'Google\'s UI toolkit for mobile apps', order: 1 },
];

// Partners
const partners = [
  { name: 'AWS', subtitle: 'Amazon Web Services', order: 0, website: 'https://aws.amazon.com' },
  { name: 'Microsoft', subtitle: 'Azure Partner', order: 1, website: 'https://azure.microsoft.com' },
  { name: 'Google Cloud', subtitle: 'Cloud Platform', order: 2, website: 'https://cloud.google.com' },
  { name: 'MongoDB', subtitle: 'Database Partner', order: 3, website: 'https://www.mongodb.com' },
];

// Pricing Plans
const pricingPlans = [
  {
    name: 'Starter',
    description: 'Perfect for small projects and startups',
    price: 999,
    currency: 'USD',
    period: 'monthly',
    features: [
      'Up to 5 team members',
      'Basic support',
      'Standard development tools',
      'Monthly progress reports',
      'Email support',
    ],
    popular: false,
    order: 0,
  },
  {
    name: 'Professional',
    description: 'Ideal for growing businesses',
    price: 2499,
    currency: 'USD',
    period: 'monthly',
    features: [
      'Up to 15 team members',
      'Priority support',
      'Advanced development tools',
      'Weekly progress reports',
      'Dedicated project manager',
      '24/7 support',
    ],
    popular: true,
    order: 1,
  },
  {
    name: 'Enterprise',
    description: 'For large-scale organizations',
    price: 4999,
    currency: 'USD',
    period: 'monthly',
    features: [
      'Unlimited team members',
      'Premium support',
      'Enterprise-grade tools',
      'Daily progress reports',
      'Dedicated team',
      '24/7 priority support',
      'Custom SLA',
      'On-site consultation',
    ],
    popular: false,
    order: 2,
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

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

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// CLEANUP FUNCTIONS - Remove non-IT data
// ============================================================================

async function cleanupNonITData() {
  console.log('🧹 Cleaning up non-IT related data...\n');
  
  // Note: We'll keep all data and just ensure we're seeding IT-focused content
  // If you want to delete specific non-IT items, you can add DELETE requests here
  console.log('✅ Cleanup complete (keeping existing data, adding IT-focused content)\n');
}

// ============================================================================
// SEED FUNCTIONS
// ============================================================================

async function createServiceCategory(category) {
  try {
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
    console.error(`  ❌ Failed to create category ${category.name}:`, error.response?.data?.message || error.message);
    return null;
  }
}

async function createService(service, categoryName) {
  try {
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
    console.error(`    ❌ Failed to create service ${service.name}:`, error.response?.data?.message || error.message);
    return null;
  }
}

async function createPortfolioCategory(category) {
  try {
    const response = await makeRequest(
      `${API_BASE}/portfolio-categories`,
      'POST',
      {
        name: category.name,
        description: category.description,
        order: category.order,
        status: 'active',
      },
      { Authorization: authToken }
    );
    console.log(`  ✅ Created portfolio category: ${category.name}`);
    return response.data;
  } catch (error) {
    if (error.status === 409) {
      console.log(`  ⚠️  Portfolio category already exists: ${category.name}`);
      return null;
    }
    console.error(`  ❌ Failed to create portfolio category ${category.name}:`, error.response?.data?.message || error.message);
    return null;
  }
}

async function createPortfolioProject(project) {
  try {
    const response = await makeRequest(
      `${API_BASE}/portfolio`,
      'POST',
      {
        name: project.name,
        category: project.category,
        clientName: project.clientName,
        timeline: project.timeline,
        problem: project.problem,
        solution: project.solution,
        description: project.description,
        techStack: project.techStack,
        screenshots: project.screenshots || [],
        featured: project.featured,
        status: 'active',
      },
      { Authorization: authToken }
    );
    console.log(`    ✅ Created portfolio: ${project.name}`);
    return response.data;
  } catch (error) {
    if (error.status === 409) {
      console.log(`    ⚠️  Portfolio already exists: ${project.name}`);
      return null;
    }
    console.error(`    ❌ Failed to create portfolio ${project.name}:`, error.response?.data?.message || error.message);
    return null;
  }
}

async function createBlogCategory(category) {
  try {
    const response = await makeRequest(
      `${API_BASE}/blog-categories`,
      'POST',
      {
        name: category.name,
        description: category.description,
        order: category.order,
        color: category.color,
        status: 'active',
      },
      { Authorization: authToken }
    );
    console.log(`  ✅ Created blog category: ${category.name}`);
    return response.data;
  } catch (error) {
    if (error.status === 409) {
      console.log(`  ⚠️  Blog category already exists: ${category.name}`);
      return null;
    }
    console.error(`  ❌ Failed to create blog category ${category.name}:`, error.response?.data?.message || error.message);
    return null;
  }
}

async function createBlogPost(post) {
  try {
    const response = await makeRequest(
      `${API_BASE}/blog`,
      'POST',
      {
        title: post.title,
        description: post.description,
        contentHtml: post.contentHtml,
        category: post.category,
        tags: post.tags,
        status: post.status,
      },
      { Authorization: authToken }
    );
    console.log(`    ✅ Created blog post: ${post.title}`);
    return response.data;
  } catch (error) {
    if (error.status === 409) {
      console.log(`    ⚠️  Blog post already exists: ${post.title}`);
      return null;
    }
    console.error(`    ❌ Failed to create blog post ${post.title}:`, error.response?.data?.message || error.message);
    return null;
  }
}

async function createTeamMember(member) {
  try {
    const response = await makeRequest(
      `${API_BASE}/team`,
      'POST',
      {
        name: member.name,
        role: member.role,
        description: member.description,
        social: member.social,
        order: member.order,
        status: 'active',
      },
      { Authorization: authToken }
    );
    console.log(`    ✅ Created team member: ${member.name}`);
    return response.data;
  } catch (error) {
    if (error.status === 409) {
      console.log(`    ⚠️  Team member already exists: ${member.name}`);
      return null;
    }
    console.error(`    ❌ Failed to create team member ${member.name}:`, error.response?.data?.message || error.message);
    return null;
  }
}

async function createTestimonial(testimonial) {
  try {
    const response = await makeRequest(
      `${API_BASE}/testimonials`,
      'POST',
      {
        clientName: testimonial.clientName,
        review: testimonial.review,
        rating: testimonial.rating,
        category: testimonial.category,
        featured: testimonial.featured,
        status: 'active',
      },
      { Authorization: authToken }
    );
    console.log(`    ✅ Created testimonial: ${testimonial.clientName}`);
    return response.data;
  } catch (error) {
    if (error.status === 409) {
      console.log(`    ⚠️  Testimonial already exists: ${testimonial.clientName}`);
      return null;
    }
    console.error(`    ❌ Failed to create testimonial ${testimonial.clientName}:`, error.response?.data?.message || error.message);
    return null;
  }
}

async function createTechStack(tech) {
  try {
    const response = await makeRequest(
      `${API_BASE}/tech-stack`,
      'POST',
      {
        name: tech.name,
        category: tech.category,
        description: tech.description,
        order: tech.order,
        status: 'active',
      },
      { Authorization: authToken }
    );
    console.log(`    ✅ Created tech: ${tech.name}`);
    return response.data;
  } catch (error) {
    if (error.status === 409) {
      console.log(`    ⚠️  Tech already exists: ${tech.name}`);
      return null;
    }
    console.error(`    ❌ Failed to create tech ${tech.name}:`, error.response?.data?.message || error.message);
    return null;
  }
}

async function createPartner(partner) {
  try {
    const response = await makeRequest(
      `${API_BASE}/partners`,
      'POST',
      {
        name: partner.name,
        subtitle: partner.subtitle,
        order: partner.order,
        website: partner.website,
        status: 'active',
      },
      { Authorization: authToken }
    );
    console.log(`    ✅ Created partner: ${partner.name}`);
    return response.data;
  } catch (error) {
    if (error.status === 409) {
      console.log(`    ⚠️  Partner already exists: ${partner.name}`);
      return null;
    }
    console.error(`    ❌ Failed to create partner ${partner.name}:`, error.response?.data?.message || error.message);
    return null;
  }
}

async function createPricingPlan(plan) {
  try {
    const response = await makeRequest(
      `${API_BASE}/pricing`,
      'POST',
      {
        name: plan.name,
        description: plan.description,
        price: plan.price,
        currency: plan.currency,
        period: plan.period,
        features: plan.features,
        popular: plan.popular,
        order: plan.order,
        status: 'active',
      },
      { Authorization: authToken }
    );
    console.log(`    ✅ Created pricing plan: ${plan.name}`);
    return response.data;
  } catch (error) {
    if (error.status === 409) {
      console.log(`    ⚠️  Pricing plan already exists: ${plan.name}`);
      return null;
    }
    console.error(`    ❌ Failed to create pricing plan ${plan.name}:`, error.response?.data?.message || error.message);
    return null;
  }
}

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================

async function seedAllData() {
  console.log('🚀 Starting comprehensive IT website data seed...\n');

  // Login
  const loggedIn = await login();
  if (!loggedIn) {
    console.error('❌ Cannot proceed without authentication');
    process.exit(1);
  }

  // Cleanup
  await cleanupNonITData();

  // 1. Service Categories & Services
  console.log('📁 Creating service categories...');
  const createdCategories = {};
  for (const category of serviceCategories) {
    const created = await createServiceCategory(category);
    if (created) createdCategories[category.name] = created;
    await delay(200);
  }
  
  console.log('\n📦 Creating services...\n');
  for (const [categoryName, servicesList] of Object.entries(services)) {
    if (createdCategories[categoryName]) {
      console.log(`🤖 Creating ${categoryName} services...`);
      for (const service of servicesList) {
        await createService(service, categoryName);
        await delay(200);
      }
      console.log('');
    }
  }

  // 2. Portfolio Categories & Projects
  console.log('📁 Creating portfolio categories...');
  const createdPortfolioCategories = {};
  for (const category of portfolioCategories) {
    const created = await createPortfolioCategory(category);
    if (created) createdPortfolioCategories[category.name] = created;
    await delay(200);
  }
  
  console.log('\n💼 Creating portfolio projects...\n');
  for (const project of portfolioProjects) {
    await createPortfolioProject(project);
    await delay(200);
  }

  // 3. Blog Categories & Posts
  console.log('\n📁 Creating blog categories...');
  const createdBlogCategories = {};
  for (const category of blogCategories) {
    const created = await createBlogCategory(category);
    if (created) createdBlogCategories[category.name] = created;
    await delay(200);
  }
  
  console.log('\n📝 Creating blog posts...\n');
  for (const post of blogPosts) {
    await createBlogPost(post);
    await delay(200);
  }

  // 4. Team Members
  console.log('\n👥 Creating team members...\n');
  for (const member of teamMembers) {
    await createTeamMember(member);
    await delay(200);
  }

  // 5. Testimonials
  console.log('\n💬 Creating testimonials...\n');
  for (const testimonial of testimonials) {
    await createTestimonial(testimonial);
    await delay(200);
  }

  // 6. Tech Stack
  console.log('\n🛠️  Creating tech stack...\n');
  for (const tech of techStack) {
    await createTechStack(tech);
    await delay(200);
  }

  // 7. Partners
  console.log('\n🤝 Creating partners...\n');
  for (const partner of partners) {
    await createPartner(partner);
    await delay(200);
  }

  // 8. Pricing Plans
  console.log('\n💰 Creating pricing plans...\n');
  for (const plan of pricingPlans) {
    await createPricingPlan(plan);
    await delay(200);
  }

  console.log('\n✨ Seed process completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Service Categories: ${serviceCategories.length}`);
  console.log(`   - Services: ${Object.values(services).flat().length}`);
  console.log(`   - Portfolio Categories: ${portfolioCategories.length}`);
  console.log(`   - Portfolio Projects: ${portfolioProjects.length}`);
  console.log(`   - Blog Categories: ${blogCategories.length}`);
  console.log(`   - Blog Posts: ${blogPosts.length}`);
  console.log(`   - Team Members: ${teamMembers.length}`);
  console.log(`   - Testimonials: ${testimonials.length}`);
  console.log(`   - Tech Stack: ${techStack.length}`);
  console.log(`   - Partners: ${partners.length}`);
  console.log(`   - Pricing Plans: ${pricingPlans.length}`);
  console.log('\n🎉 Your IT website is now fully populated with production-ready data!');
}

// Run the seed script
seedAllData().catch((error) => {
  console.error('❌ Seed process failed:', error);
  process.exit(1);
});

