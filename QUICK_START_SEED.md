# Quick Start: Seed Custom Services Data

## Problem: "Invalid credentials" error

If you're getting an "Invalid credentials" error, you need to create an admin user first.

## Solution: Two-Step Process

### Step 1: Create Admin User

First, create an admin user account:

```bash
cd nullscape-backend
npm run create-admin
```

Or with custom credentials:

```bash
node scripts/createAdminUser.js your-email@example.com your-password "Your Name"
```

This will create:
- An admin user with the email/password you specify
- An "Admin" role if it doesn't exist
- Link the user to the Admin role

### Step 2: Run Seed Script

Now run the seed script with your credentials:

```bash
npm run seed-services
```

Or with custom credentials:

```bash
node scripts/seedCustomServices.js your-email@example.com your-password
```

## Alternative: Use Existing Admin Account

If you already have an admin account, just pass the credentials:

```bash
node scripts/seedCustomServices.js existing-admin@example.com existing-password
```

## Environment Variables (Optional)

You can also set credentials in your `.env` file:

```env
ADMIN_EMAIL=admin@nullscape.com
ADMIN_PASSWORD=your-secure-password
MONGODB_URI=mongodb://localhost:27017/nullscape
API_BASE_URL=http://localhost:4000/api/v1
```

Then run:

```bash
npm run seed-services
```

## What Gets Created

✅ **8 Service Categories:**
- AI & ML
- Cloud Computing
- Custom SW Solutions
- Data Engineering
- Digital Commerce
- Mobile App Development
- Product Engineering
- SW Testing & QA

✅ **30+ Services** including:
- 6 AI & ML services (matching the image)
- Services for all other categories

All items are created with `status: 'active'` and will appear immediately on the website!

