#!/usr/bin/env node

/**
 * Create Database Indexes Script
 * Run this to optimize database queries
 */

import 'dotenv/config';
import { connectMongo } from '../src/config/mongo.js';
import { createIndexes } from '../src/models/indexes.js';

async function main() {
  try {
    console.log('Connecting to MongoDB...');
    await connectMongo();
    
    console.log('Creating indexes...');
    await createIndexes();
    
    console.log('✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();

