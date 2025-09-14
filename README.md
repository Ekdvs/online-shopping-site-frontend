# Online Shopping Site Frontend

A modern, responsive frontend for an online shopping platform built with React and Vite.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://your-deployed-app.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/yourusername/your-repo)

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Development](#development)
  - [Building for Production](#building-for-production)
- [API Integration](#api-integration)
- [Authentication](#authentication)
- [Routing](#routing)
- [State Management](#state-management)
- [Styling](#styling)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 About

This is the frontend application for a comprehensive online shopping platform. It provides a modern, intuitive user interface for customers to browse products, manage their shopping cart, place orders, and for administrators to manage the store operations.

## ✨ Features

### Customer Features
- 🔐 User registration and authentication
- 🛍️ Product browsing with search and filters
- 📱 Responsive design for mobile and desktop
- 🛒 Shopping cart management
- 💳 Secure checkout process
- 📦 Order history and tracking
- 👤 User profile management
- ⭐ Product reviews and ratings
- 🔍 Advanced product search
- 📂 Category-based navigation

### Admin Features
- 📊 Admin dashboard
- 📦 Product management (CRUD operations)
- 👥 User management
- 📋 Order management
- 📈 Sales analytics
- 🏷️ Category management

### Technical Features
- ⚡ Fast loading with Vite
- 🔄 Real-time updates
- 📱 Progressive Web App (PWA) ready
- 🌐 SEO optimized
- 🛡️ Protected routes
- 🍞 Toast notifications
- 📊 Loading states and error handling

## 🚀 Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Styling:** Tailwind CSS / CSS Modules
- **State Management:** Context API / Redux Toolkit
- **Form Handling:** React Hook Form
- **Validation:** Yup / Zod
- **Notifications:** React Hot Toast
- **Icons:** Lucide React / React Icons
- **Date Handling:** Date-fns
- **Image Optimization:** React Image Gallery
- **Development Tools:** ESLint, Prettier

## 📸 Screenshots

| Home Page | Product Listing | Shopping Cart |
|-----------|-----------------|---------------|
| ![Home](screenshots/home.png) | ![Products](screenshots/products.png) | ![Cart](screenshots/cart.png) |

| Admin Dashboard | Mobile View |
|-----------------|-------------|
| ![Admin](screenshots/admin.png) | ![Mobile](screenshots/mobile.png) |

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Common components (Header, Footer, etc.)
│   ├── forms/           # Form components
│   ├── ui/              # UI primitives (Button, Input, etc.)
│   └── layout/          # Layout components
├── pages/               # Page components
│   ├── auth/           # Authentication pages
│   ├── shop/           # Shopping pages
│   ├── admin/          # Admin pages
│   └── user/           # User profile pages
├── hooks/              # Custom React hooks
├── context/            # React Context providers
├── services/           # API service functions
├── utils/              # Utility functions
├── constants/          # Application constants
├── assets/             # Static assets
├── styles/             # Global styles
└── types/              # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

Before running this project, make sure you have:

- Node.js (version 16.0 or higher)
- npm or yarn package manager
- Backend API server running
- Git for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/online-shopping-frontend.git
   cd online-shopping-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_TIMEOUT=10000

# Authentication
VITE_JWT_SECRET=your-jwt-secret
VITE_TOKEN_EXPIRY=24h

# Payment Integration (if applicable)
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_key
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id

# Image Upload (if applicable)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Analytics (optional)
VITE_GOOGLE_ANALYTICS_ID=GA_TRACKING_ID

# Development
VITE_APP_NAME=Online Shopping Site
VITE_APP_VERSION=1.0.0
```

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### Building for Production

1. **Create production build**
   ```bash
   npm run build
   # or
   yarn build
   ```

2. **Preview production build locally**
   ```bash
   npm run preview
   # or
   yarn preview
   ```

## 🔌 API Integration

The application integrates with a REST API backend. Key API endpoints include:

### Authentication Endpoints
```javascript
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
POST /api/auth/logout       # User logout
GET  /api/auth/profile      # Get user profile
PUT  /api/auth/profile      # Update user profile
```

### Product Endpoints
```javascript
GET    /api/products        # Get all products
GET    /api/products/:id    # Get product by ID
GET    /api/categories      # Get all categories
GET    /api/products/search # Search products
```

### Cart & Orders
```javascript
GET    /api/cart           # Get user's cart
POST   /api/cart/add       # Add item to cart
PUT    /api/cart/update    # Update cart item
DELETE /api/cart/remove    # Remove item from cart
POST   /api/orders         # Create new order
GET    /api/orders         # Get user's orders
```

### Admin Endpoints
```javascript
GET    /api/admin/users     # Get all users
GET    /api/admin/orders    # Get all orders
POST   /api/admin/products  # Create product
PUT    /api/admin/products/:id # Update product
DELETE /api/admin/products/:id # Delete product
```

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

- Tokens are stored in localStorage
- Automatic token refresh
- Protected routes require authentication
- Role-based access control (Customer/Admin)

### Authentication Flow
1. User logs in with credentials
2. Server returns JWT token
3. Token is stored in localStorage
4. Token is sent with every API request
5. Protected routes check for valid token

## 🛣️ Routing

The application uses React Router for client-side routing:

```javascript
/                    # Home page
/products           # Product listing
/products/:id       # Product details
/cart               # Shopping cart
/checkout           # Checkout process
/orders             # Order history
/profile            # User profile
/login              # Login page
/register           # Registration page
/admin              # Admin dashboard (protected)
/admin/products     # Product management
/admin/orders       # Order management
/admin/users        # User management
```

## 🏪 State Management

The application uses a combination of:

- **React Context** for global state (user authentication, theme)
- **useState/useReducer** for local component state
- **Custom hooks** for shared logic
- **Local Storage** for persistence

## 🎨 Styling

The project uses modern CSS approaches:

- **Tailwind CSS** for utility-first styling
- **CSS Modules** for component-specific styles
- **Responsive design** with mobile-first approach
- **CSS Variables** for theming
- **CSS Grid & Flexbox** for layouts

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

Testing tools used:
- Jest for unit testing
- React Testing Library for component testing
- Cypress for E2E testing

## 🚀 Deployment

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Deploy to Netlify

1. Build the project: `npm run build`
2. Drag and drop the `dist` folder to Netlify
3. Configure environment variables in Netlify dashboard

### Deploy to AWS S3 + CloudFront

1. Build the project: `npm run build`
2. Upload `dist` folder to S3 bucket
3. Configure CloudFront distribution
4. Set up custom domain (optional)

## 📊 Performance Optimization

- **Code Splitting:** Dynamic imports for route-based splitting
- **Lazy Loading:** Images and components loaded on demand
- **Bundle Analysis:** Use `npm run analyze` to check bundle size
- **Caching:** API responses cached with proper cache headers
- **Image Optimization:** WebP format with fallbacks

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Create production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run analyze      # Analyze bundle size
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Use ESLint and Prettier for code formatting
- Follow conventional commit messages
- Write tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite team for the lightning-fast build tool
- Tailwind CSS for the utility-first CSS framework
- All contributors who helped build this project

## 📞 Contact & Support

- **Project Link:** [https://github.com/yourusername/online-shopping-frontend](https://github.com/yourusername/online-shopping-frontend)
- **Issues:** [Report a bug or request a feature](https://github.com/yourusername/online-shopping-frontend/issues)
- **Email:** your.email@example.com

---

⭐ If you found this project helpful, please give it a star on GitHub!