/**
 * Database Indexes Configuration
 * Run this to ensure all indexes are created for optimal query performance
 */

import mongoose from 'mongoose';
import { Service } from './Service.js';
import { BlogPost } from './BlogPost.js';
import { PortfolioProject } from './PortfolioProject.js';
import { Testimonial } from './Testimonial.js';
import { TeamMember } from './TeamMember.js';
import { PricingPlan } from './PricingPlan.js';
import { Inquiry } from './Inquiry.js';
import { Subscriber } from './Subscriber.js';
import logger from '../utils/logger.js';

export async function createIndexes() {
  try {
    logger.info('Creating database indexes...');

    // Service indexes
    await Service.createIndexes();
    await Service.collection.createIndex({ status: 1, createdAt: -1 });
    await Service.collection.createIndex({ slug: 1 }, { unique: true });

    // Blog indexes
    await BlogPost.createIndexes();
    await BlogPost.collection.createIndex({ status: 1, publishedAt: -1 });
    await BlogPost.collection.createIndex({ slug: 1 }, { unique: true });
    await BlogPost.collection.createIndex({ category: 1, status: 1 });
    await BlogPost.collection.createIndex({ tags: 1 });

    // Portfolio indexes
    await PortfolioProject.createIndexes();
    await PortfolioProject.collection.createIndex({ status: 1, createdAt: -1 });
    await PortfolioProject.collection.createIndex({ category: 1, status: 1 });
    await PortfolioProject.collection.createIndex({ featured: 1, status: 1 });

    // Testimonial indexes
    await Testimonial.createIndexes();
    await Testimonial.collection.createIndex({ status: 1, featured: 1 });
    await Testimonial.collection.createIndex({ createdAt: -1 });

    // Team member indexes
    await TeamMember.createIndexes();
    await TeamMember.collection.createIndex({ status: 1, order: 1 });

    // Pricing plan indexes
    await PricingPlan.createIndexes();
    await PricingPlan.collection.createIndex({ status: 1, order: 1 });
    await PricingPlan.collection.createIndex({ featured: 1, status: 1 });

    // Inquiry indexes
    await Inquiry.createIndexes();
    await Inquiry.collection.createIndex({ resolved: 1, createdAt: -1 });
    await Inquiry.collection.createIndex({ type: 1, createdAt: -1 });
    await Inquiry.collection.createIndex({ email: 1 });

    // Subscriber indexes
    await Subscriber.createIndexes();
    await Subscriber.collection.createIndex({ email: 1 }, { unique: true });
    await Subscriber.collection.createIndex({ status: 1, createdAt: -1 });

    logger.info('✅ All database indexes created successfully');
  } catch (error) {
    logger.error('Error creating indexes', {
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
}

