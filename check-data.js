import 'dotenv/config';
import { connectMongo } from './src/config/mongo.js';
import { Service } from './src/models/Service.js';
import { PortfolioProject } from './src/models/PortfolioProject.js';
import { Testimonial } from './src/models/Testimonial.js';
import { BlogPost } from './src/models/BlogPost.js';
import { TeamMember } from './src/models/TeamMember.js';
import { TechStack } from './src/models/TechStack.js';
import { PricingPlan } from './src/models/PricingPlan.js';

async function checkData() {
  try {
    await connectMongo();
    
    console.log('\n=== DATABASE CONTENT CHECK ===\n');
    
    // Check Services
    const allServices = await Service.find({});
    const activeServices = await Service.find({ status: 'active' });
    console.log(`Services: ${allServices.length} total, ${activeServices.length} active`);
    if (allServices.length > 0) {
      console.log('  All services:');
      allServices.forEach(s => {
        console.log(`    - ${s.name} (status: "${s.status}")`);
      });
    }
    
    // Check Portfolio
    const allPortfolio = await PortfolioProject.find({});
    const activePortfolio = await PortfolioProject.find({ status: 'active' });
    console.log(`\nPortfolio: ${allPortfolio.length} total, ${activePortfolio.length} active`);
    if (allPortfolio.length > 0) {
      console.log('  All portfolio items:');
      allPortfolio.forEach(p => {
        console.log(`    - ${p.name} (status: "${p.status}")`);
      });
    }
    
    // Check Testimonials
    const allTestimonials = await Testimonial.find({});
    const activeTestimonials = await Testimonial.find({ status: 'active' });
    console.log(`\nTestimonials: ${allTestimonials.length} total, ${activeTestimonials.length} active`);
    if (allTestimonials.length > 0) {
      console.log('  All testimonials:');
      allTestimonials.forEach(t => {
        console.log(`    - ${t.clientName} (status: "${t.status}")`);
      });
    }
    
    // Check Blog Posts
    const allBlogs = await BlogPost.find({});
    const publishedBlogs = await BlogPost.find({ status: 'published' });
    console.log(`\nBlog Posts: ${allBlogs.length} total, ${publishedBlogs.length} published`);
    if (allBlogs.length > 0) {
      console.log('  All blog posts:');
      allBlogs.forEach(b => {
        console.log(`    - ${b.title} (status: "${b.status}")`);
      });
    }
    
    // Check Team
    const allTeam = await TeamMember.find({});
    const activeTeam = await TeamMember.find({ status: 'active' });
    console.log(`\nTeam Members: ${allTeam.length} total, ${activeTeam.length} active`);
    if (allTeam.length > 0) {
      console.log('  All team members:');
      allTeam.forEach(t => {
        console.log(`    - ${t.name} (status: "${t.status}")`);
      });
    }
    
    // Check Tech Stack
    const allTech = await TechStack.find({});
    const activeTech = await TechStack.find({ status: 'active' });
    console.log(`\nTech Stack: ${allTech.length} total, ${activeTech.length} active`);
    if (allTech.length > 0) {
      console.log('  All tech items:');
      allTech.forEach(t => {
        console.log(`    - ${t.name} (status: "${t.status}")`);
      });
    }
    
    // Check Pricing
    const allPricing = await PricingPlan.find({});
    const activePricing = await PricingPlan.find({ status: 'active' });
    console.log(`\nPricing Plans: ${allPricing.length} total, ${activePricing.length} active`);
    if (allPricing.length > 0) {
      console.log('  All pricing plans:');
      allPricing.forEach(p => {
        console.log(`    - ${p.name} (status: "${p.status}")`);
      });
    }
    
    console.log('\n=== SUMMARY ===');
    console.log(`Total items in database: ${allServices.length + allPortfolio.length + allTestimonials.length + allBlogs.length + allTeam.length + allTech.length + allPricing.length}`);
    console.log(`Active/Published items: ${activeServices.length + activePortfolio.length + activeTestimonials.length + publishedBlogs.length + activeTeam.length + activeTech.length + activePricing.length}`);
    
    if (allServices.length === 0 && allPortfolio.length === 0 && allTestimonials.length === 0) {
      console.log('\n⚠️  WARNING: No data found in database!');
      console.log('   Please add content through the admin panel first.');
    } else if (activeServices.length === 0 && activePortfolio.length === 0 && activeTestimonials.length === 0) {
      console.log('\n⚠️  WARNING: Data exists but no items have "active" or "published" status!');
      console.log('   Please update the status field to "active" or "published" in the admin panel.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkData();


