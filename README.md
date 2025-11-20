# Backend API Module

This is the backend API server module. It contains all business logic, database models, API routes, and server configuration.

## 📁 Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   │   └── mongo.js    # MongoDB connection
│   ├── controllers/    # Request handlers
│   │   ├── authController.js
│   │   ├── crudFactory.js
│   │   └── ...
│   ├── middlewares/    # Express middlewares
│   │   ├── auth.js     # Authentication
│   │   ├── error.js    # Error handling
│   │   ├── rateLimiter.js
│   │   └── validate.js
│   ├── models/         # Database models (Mongoose)
│   │   ├── User.js
│   │   ├── Service.js
│   │   ├── BlogPost.js
│   │   └── ...
│   ├── routes/         # API routes
│   │   └── v1/         # API version 1
│   │       ├── auth.routes.js
│   │       ├── services.routes.js
│   │       └── ...
│   ├── services/       # Business logic services
│   │   └── authService.js
│   ├── utils/          # Utility functions
│   │   ├── logger.js   # Winston logger
│   │   ├── cache.js    # Response caching
│   │   └── ...
│   ├── validators/     # Request validation schemas
│   │   ├── auth.js
│   │   └── ...
│   ├── uploads/        # File uploads directory
│   └── server.js       # Express server entry point
├── scripts/            # Utility scripts
│   └── create-indexes.js
├── ecosystem.config.js # PM2 configuration
├── package.json
└── .env.example        # Environment variables template
```

## 🚀 Development

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)

### Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
```

### Run Development Server

```bash
npm run dev
# Server runs on http://localhost:4000
```

### Create Database Indexes

```bash
npm run create-indexes
```

## 📡 API Endpoints

All API routes are prefixed with `/api/v1`

### Public Endpoints
- `GET /api/v1/services` - Get active services
- `GET /api/v1/blog` - Get published blog posts
- `GET /api/v1/portfolio` - Get active portfolio projects
- `GET /api/v1/testimonials` - Get active testimonials
- `GET /api/v1/team` - Get active team members
- `GET /api/v1/pricing` - Get active pricing plans
- `POST /api/v1/inquiries` - Submit contact form
- `POST /api/v1/newsletter/subscribe` - Newsletter subscription

### Protected Endpoints (Admin)
- `POST /api/v1/auth/login` - Admin login
- `GET /api/v1/auth/me` - Get current user
- `GET /api/v1/*` - Admin CRUD operations

## 🔧 Configuration

### Environment Variables

Create `.env` file with:

```env
NODE_ENV=production
PORT=4000
MONGODB_URI=mongodb://...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
CORS_ORIGIN=https://www.yourdomain.com,https://admin.yourdomain.com
SITE_URL=https://www.yourdomain.com
```

## 🔒 Security Features

- ✅ JWT authentication
- ✅ Rate limiting (API, Auth, Forms)
- ✅ Input sanitization (XSS, NoSQL injection prevention)
- ✅ CORS protection
- ✅ Request size limits
- ✅ Structured logging (no sensitive data leaks)

## 📊 Performance

- ✅ API response caching (5-15 minutes)
- ✅ Database query optimization (.lean(), indexes)
- ✅ Winston logging with rotation
- ✅ Compression middleware

## 🚀 Production Deployment

```bash
# Build (no build step needed, but ensure env vars are set)
cp .env.example .env
# Edit .env with production values

# Create database indexes
npm run create-indexes

# Start with PM2
pm2 start ecosystem.config.js --env production

# Or with Node
NODE_ENV=production npm start
```

## 📚 Documentation

- See root `README.md` for full project documentation
- See `DEPLOYMENT_QUICK_START.md` for deployment guide
- See `PM2_PRODUCTION_SETUP.md` for PM2 setup

## ⚠️ Important Notes

- **Admin-only logic**: Admin-specific routes are protected
- **API boundaries**: No direct database access from frontend
- **CORS**: Configure allowed origins in production
- **Logs**: Logs are stored in `logs/` directory (created automatically)
