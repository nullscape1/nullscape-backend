/**
 * Update existing services to assign them to categories
 * This script will update services that don't have categories assigned
 * 
 * Usage: node scripts/updateServiceCategories.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Service } from '../src/models/Service.js';
import { ServiceCategory } from '../src/models/ServiceCategory.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nullscape';

// Mapping of service names to categories (for existing services)
const serviceCategoryMapping = {
  // AI & ML services
  'Generative AI': 'AI & ML',
  'Computer Vision': 'AI & ML',
  'Machine Learning': 'AI & ML',
  'LLM Integration': 'AI & ML',
  'MLOps': 'AI & ML',
  'Deep Learning Solutions': 'AI & ML',
  
  // Cloud Computing
  'AWS Solutions': 'Cloud Computing',
  'Azure Services': 'Cloud Computing',
  'Google Cloud': 'Cloud Computing',
  'DevOps & CI/CD': 'Cloud Computing',
  
  // Custom SW Solutions
  'Enterprise Software': 'Custom SW Solutions',
  'API Development': 'Custom SW Solutions',
  'Microservices Architecture': 'Custom SW Solutions',
  
  // Data Engineering
  'Data Pipelines': 'Data Engineering',
  'Big Data Solutions': 'Data Engineering',
  'Data Warehousing': 'Data Engineering',
  
  // Digital Commerce
  'E-commerce Platforms': 'Digital Commerce',
  'Payment Integration': 'Digital Commerce',
  'Marketplace Solutions': 'Digital Commerce',
  
  // Mobile App Development
  'iOS Development': 'Mobile App Development',
  'Android Development': 'Mobile App Development',
  'React Native': 'Mobile App Development',
  'Flutter Apps': 'Mobile App Development',
  
  // Product Engineering
  'MVP Development': 'Product Engineering',
  'Product Strategy': 'Product Engineering',
  'Technical Architecture': 'Product Engineering',
  
  // SW Testing & QA
  'Automated Testing': 'SW Testing & QA',
  'Performance Testing': 'SW Testing & QA',
  'Security Testing': 'SW Testing & QA',
};

async function updateServiceCategories() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all categories
    const categories = await ServiceCategory.find({ status: 'active' });
    const categoryMap = new Map();
    categories.forEach(cat => {
      categoryMap.set(cat.name, cat);
    });

    console.log(`📁 Found ${categories.length} active categories\n`);

    // Get all services without categories
    const servicesWithoutCategory = await Service.find({
      $or: [
        { category: { $exists: false } },
        { category: null },
        { category: '' },
      ],
    });

    console.log(`📦 Found ${servicesWithoutCategory.length} services without categories\n`);

    let updated = 0;
    let skipped = 0;

    for (const service of servicesWithoutCategory) {
      const categoryName = serviceCategoryMapping[service.name];
      
      if (categoryName && categoryMap.has(categoryName)) {
        const category = categoryMap.get(categoryName);
        service.category = category.name;
        service.categoryId = category._id;
        await service.save();
        console.log(`  ✅ Updated "${service.name}" → "${categoryName}"`);
        updated++;
      } else {
        console.log(`  ⚠️  No category mapping for "${service.name}"`);
        skipped++;
      }
    }

    // Also update services that have category name but not categoryId
    const servicesWithoutCategoryId = await Service.find({
      category: { $exists: true, $ne: null, $ne: '' },
      $or: [
        { categoryId: { $exists: false } },
        { categoryId: null },
      ],
    });

    console.log(`\n📦 Found ${servicesWithoutCategoryId.length} services with category name but no categoryId\n`);

    for (const service of servicesWithoutCategoryId) {
      const category = categoryMap.get(service.category);
      if (category) {
        service.categoryId = category._id;
        await service.save();
        console.log(`  ✅ Updated categoryId for "${service.name}" (${service.category})`);
        updated++;
      } else {
        console.log(`  ⚠️  Category "${service.category}" not found for service "${service.name}"`);
        skipped++;
      }
    }

    console.log('\n✨ Update process completed!');
    console.log(`   - Services updated: ${updated}`);
    console.log(`   - Services skipped: ${skipped}`);

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error updating service categories:', error.message);
    process.exit(1);
  }
}

updateServiceCategories();

