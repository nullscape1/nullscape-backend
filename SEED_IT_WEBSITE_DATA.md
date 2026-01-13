# Seed IT Website Data - Complete Guide

This guide explains how to populate your website with comprehensive IT-related data for production.

## Overview

The seed scripts will populate your database with:
- ✅ **Service Categories** (8 IT-focused categories)
- ✅ **Services** (30+ IT services)
- ✅ **Portfolio Projects** (6 IT projects with case studies)
- ✅ **Portfolio Categories** (5 categories)
- ✅ **Blog Posts** (5 IT-related articles)
- ✅ **Blog Categories** (5 categories)
- ✅ **Team Members** (5 IT professionals)
- ✅ **Testimonials** (5 client testimonials)
- ✅ **Tech Stack** (20+ technologies)
- ✅ **Partners** (4 IT partners)
- ✅ **Pricing Plans** (3 plans)

## Prerequisites

1. **Backend server must be running**
2. **Admin user account must exist**
3. **Environment variables set** (or use defaults)

## Step 1: Create Admin User (if needed)

If you don't have an admin user yet:

```bash
cd nullscape-backend
npm run create-admin
```

Or with custom credentials:

```bash
node scripts/createAdminUser.js your-email@example.com your-password "Your Name"
```

## Step 2: Clean Non-IT Data (Optional)

Before seeding, you can remove any non-IT related data:

```bash
npm run cleanup-non-it
```

Or with custom credentials:

```bash
node scripts/cleanupNonITData.js your-email@example.com your-password
```

This script will identify and remove data containing non-IT keywords like:
- Restaurant, food, cooking
- Fashion, retail, shopping
- Real estate, construction
- Healthcare, medical
- Education, school
- And other non-IT related content

## Step 3: Seed All IT Website Data

Run the comprehensive seed script:

```bash
npm run seed-all
```

Or with custom credentials:

```bash
node scripts/seedITWebsiteData.js your-email@example.com your-password
```

## Environment Variables

You can set these in your `.env` file:

```env
ADMIN_EMAIL=admin@nullscape.com
ADMIN_PASSWORD=your-secure-password
MONGODB_URI=mongodb://localhost:27017/nullscape
API_BASE_URL=http://localhost:4000/api/v1
```

For production (Render), set:
```env
API_BASE_URL=https://your-backend.onrender.com/api/v1
```

## What Gets Created

### Service Categories (8)
- AI & ML
- Cloud Computing
- Custom SW Solutions
- Data Engineering
- Digital Commerce
- Mobile App Development
- Product Engineering
- SW Testing & QA

### Services (30+)
- **AI & ML**: Generative AI, Computer Vision, Machine Learning, LLM Integration, MLOps, Deep Learning
- **Cloud Computing**: AWS Solutions, Azure Services, Google Cloud, DevOps & CI/CD, Cloud Migration
- **Custom SW Solutions**: Enterprise Software, API Development, Microservices Architecture, Legacy System Modernization
- **Data Engineering**: Data Pipelines, Big Data Solutions, Data Warehousing, Business Intelligence
- **Digital Commerce**: E-commerce Platforms, Payment Integration, Marketplace Solutions
- **Mobile App Development**: iOS Development, Android Development, React Native, Flutter Apps
- **Product Engineering**: MVP Development, Product Strategy, Technical Architecture
- **SW Testing & QA**: Automated Testing, Performance Testing, Security Testing

### Portfolio Projects (6)
1. **AI-Powered Analytics Platform** (Featured)
2. **E-commerce Marketplace** (Featured)
3. **Healthcare Mobile App** (Featured)
4. **Cloud Migration Project**
5. **Real-time Collaboration Tool**
6. **IoT Fleet Management System**

### Blog Posts (5)
1. The Future of AI in Software Development
2. Best Practices for Cloud Migration
3. Building Scalable Microservices Architecture
4. React Native vs Flutter: Choosing the Right Framework
5. DevOps Automation: CI/CD Pipeline Best Practices

### Team Members (5)
- Chief Technology Officer
- Lead AI Engineer
- Senior Full-Stack Developer
- DevOps Engineer
- Mobile App Developer

### Testimonials (5)
- Client testimonials from IT companies
- All rated 5 stars
- Mix of featured and regular testimonials

### Tech Stack (20+)
- **Frontend**: React, Next.js, TypeScript, Vue.js
- **Backend**: Node.js, Python, Express.js, Django
- **Database**: MongoDB, PostgreSQL, Redis
- **Cloud**: AWS, Azure, Google Cloud
- **DevOps**: Docker, Kubernetes
- **Mobile**: React Native, Flutter

### Partners (4)
- AWS (Amazon Web Services)
- Microsoft (Azure Partner)
- Google Cloud
- MongoDB

### Pricing Plans (3)
- **Starter**: $999/month
- **Professional**: $2,499/month (Popular)
- **Enterprise**: $4,999/month

## Notes

- The script will **skip items that already exist** (based on name uniqueness)
- All items are created with `status: 'active'` and will appear immediately
- The script includes delays to avoid rate limiting
- Duplicate items are handled gracefully (won't cause errors)

## Troubleshooting

### Authentication Errors
1. Make sure you have an admin user account
2. Check that the email/password are correct
3. Verify the backend server is running
4. Check that the API_BASE_URL is correct

### Duplicate Errors
- This is normal - the script will skip existing items
- To re-run, you may need to delete existing data first through the admin panel

### Network Errors
- Check that the backend server is accessible
- Verify the API_BASE_URL is correct
- For production, ensure the URL uses HTTPS

## Production Deployment

For production on Render:

1. Set environment variables in Render dashboard:
   ```
   ADMIN_EMAIL=your-admin@email.com
   ADMIN_PASSWORD=your-secure-password
   API_BASE_URL=https://your-backend.onrender.com/api/v1
   ```

2. SSH into your Render instance or run locally pointing to production:
   ```bash
   API_BASE_URL=https://your-backend.onrender.com/api/v1 \
   ADMIN_EMAIL=your-admin@email.com \
   ADMIN_PASSWORD=your-password \
   node scripts/seedITWebsiteData.js
   ```

## Quick Start (All-in-One)

```bash
# 1. Create admin user
npm run create-admin

# 2. Clean non-IT data (optional)
npm run cleanup-non-it

# 3. Seed all IT website data
npm run seed-all
```

That's it! Your IT website is now fully populated with production-ready data. 🎉

