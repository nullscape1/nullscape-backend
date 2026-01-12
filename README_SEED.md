# Seed Custom Services Data

This script populates the database with dummy data for the Custom Software Development Services section.

## Prerequisites

1. Backend server must be running
2. You must have an admin user account
3. Environment variables should be set (or use defaults)

## Usage

### Option 1: Using npm script

```bash
cd nullscape-backend
npm run seed-services
```

### Option 2: Direct execution

```bash
cd nullscape-backend
node scripts/seedCustomServices.js
```

## Environment Variables

You can set these in your `.env` file or as environment variables:

- `API_BASE_URL` - Backend API URL (default: `http://localhost:4000/api/v1`)
- `ADMIN_EMAIL` - Admin email for login (default: `admin@nullscape.com`)
- `ADMIN_PASSWORD` - Admin password (default: `admin123`)

## What Gets Created

### Service Categories (8 categories):
1. AI & ML
2. Cloud Computing
3. Custom SW Solutions
4. Data Engineering
5. Digital Commerce
6. Mobile App Development
7. Product Engineering
8. SW Testing & QA

### Services (30+ services total):

**AI & ML Category (6 services):**
- Generative AI
- Computer Vision
- Machine Learning
- LLM Integration
- MLOps
- Deep Learning Solutions

**Other Categories:**
- Cloud Computing: 4 services
- Custom SW Solutions: 3 services
- Data Engineering: 3 services
- Digital Commerce: 3 services
- Mobile App Development: 4 services
- Product Engineering: 3 services
- SW Testing & QA: 3 services

## Notes

- The script will skip items that already exist (based on name uniqueness)
- All items are created with `status: 'active'`
- Services are properly categorized and ordered
- The script includes delays to avoid rate limiting

## Troubleshooting

If you get authentication errors:
1. Make sure you have an admin user account
2. Check that the email/password are correct
3. Verify the backend server is running
4. Check that the API_BASE_URL is correct

If you get duplicate errors:
- This is normal - the script will skip existing items
- To re-run, you may need to delete existing data first through the admin panel

