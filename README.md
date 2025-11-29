# CafeManager POS System and Inventory

## 📋 System Overview

**CafeManager** is a comprehensive Point of Sale (POS) and inventory management system designed for cafes and restaurants. It provides real-time inventory tracking, menu management, transaction processing, and sales reporting in a modern, responsive web application.

## 🏗️ System Architecture

### Frontend Stack
- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Custom UI Components** (Card, Button, Input, etc.)
- **Theme System** (Light/Dark mode)

### Backend Stack
- **Node.js** with Express.js
- **PostgreSQL** database
- **Rate limiting** and security middleware
- **RESTful API** architecture

## 📁 Project Structure

### Frontend Organization
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, Card)
│   ├── cashier/        # POS-specific components
│   └── layouts/        # Layout components
├── hooks/              # Custom React hooks
├── pages/              # Main application pages
├── services/           # API service layer
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### Backend Organization
```
backend/
├── controllers/        # Route handlers
├── middleware/         # Custom middleware
├── routes/            # API route definitions
├── config/            # Database configuration
└── types/             # TypeScript types
```

## 🎯 Core Features

### 1. Inventory Management
- **Real-time stock tracking** with automatic status updates
- **Low stock alerts** and critical stock warnings
- **Bulk restocking** operations
- **Category-based organization**
- **Supplier management**

### 2. Menu Management
- **Dynamic menu creation** with ingredient mapping
- **Automatic availability** based on ingredient stock
- **Category organization** (Coffee, Pastry, Food, etc.)
- **Price and description management**

### 3. Point of Sale (POS)
- **Product catalog** with search and filtering
- **Shopping cart** with quantity management
- **Multiple payment methods** (Cash, Card, Digital)
- **Receipt generation** and printing
- **Transaction history**

### 4. Reporting & Analytics
- **Sales reporting** with date filtering
- **Inventory valuation**
- **Stock level statistics**
- **Transaction summaries**

## 🔧 Key Components

### Frontend Components

#### Inventory Components
- `InventoryGrid` - Displays materials in a card layout
- `InventoryCard` - Individual material card with stock info
- `StockUpdateModal` - Modal for updating stock levels
- `MaterialEditModal` - Modal for editing material details
- `AddMaterialModal` - Modal for adding new materials

#### POS Components
- `ProductCatalog` - Product display with search/filter
- `ShoppingCart` - Cart management interface
- `CheckoutPanel` - Payment processing interface
- `TransactionHistory` - Sales history and reporting

#### Menu Components
- `MenuList` - Display all menu items
- `MenuBuilder` - Create/edit menu items with ingredients

### Backend Controllers

#### Inventory Controller (`inventoryController.ts`)
- `getMaterials` - Fetch materials with filtering/pagination
- `createMaterial` - Add new raw materials
- `updateMaterialStock` - Update stock levels
- `getStats` - Get inventory statistics
- `restockMaterials` - Bulk restock operation

#### Cashier Controller (`cashierController.ts`)
- `getProducts` - Get available products for sale
- `createTransaction` - Process new transactions
- `getTransactions` - Retrieve transaction history

#### Menu Controller (`menuController.ts`)
- `getMenus` - Fetch all menu items
- `createMenu` - Create new menu items
- `updateMenu` - Update existing menus
- `deleteMenu` - Remove menu items

## 🗄️ Database Schema

### Core Tables
- `raw_materials` - Inventory items with stock tracking
- `menus` - Menu items with pricing
- `menu_ingredients` - Junction table linking menus to materials
- `transactions` - Sales transactions
- `transaction_items` - Individual items in transactions

### Key Database Features
- **Automatic stock status** calculation via triggers
- **Menu availability** based on ingredient stock
- **Transaction integrity** with proper constraints
- **Performance indexing** on frequently queried fields

## 🔄 Data Flow

### Inventory Management Flow
1. **Material Creation** → Database insert with validation
2. **Stock Updates** → Automatic status recalculation
3. **Menu Availability** → Real-time updates based on stock
4. **Reporting** → Aggregate statistics calculation

### POS Transaction Flow
1. **Product Selection** → Cart management
2. **Checkout** → Transaction creation
3. **Inventory Deduction** → Automatic stock reduction
4. **Receipt Generation** → PDF/print output

## 🛡️ Security & Validation

### Backend Security
- **Rate limiting** (100 requests/15 minutes per IP)
- **Input validation** middleware
- **SQL injection protection** via parameterized queries
- **CORS configuration** for cross-origin requests

### Data Validation
- **Material validation** (required fields, data types)
- **Stock constraints** (non-negative values)
- **Transaction integrity** (foreign key constraints)

## 🎨 UI/UX Features

### Theme System
- **Light/Dark mode** toggle
- **Consistent design system** with custom CSS variables
- **Responsive design** for mobile and desktop

### User Experience
- **Real-time updates** without page refresh
- **Loading states** and error handling
- **Confirmation modals** for destructive actions
- **Search and filtering** across all lists

## 🔌 API Endpoints

### Inventory Routes
- `GET /api/inventory/materials` - List materials
- `POST /api/inventory/materials` - Create material
- `PATCH /api/inventory/materials/:id/stock` - Update stock
- `GET /api/inventory/materials/stats` - Get statistics

### Cashier Routes
- `GET /api/cashier/products` - Get sellable products
- `POST /api/cashier/transactions` - Create transaction
- `GET /api/cashier/transactions` - List transactions

### Menu Routes
- `GET /api/menu` - List menu items
- `POST /api/menu` - Create menu item
- `PUT /api/menu/:id` - Update menu item

## 🚀 Key Technical Features

### Real-time Updates
- **Automatic menu availability** based on ingredient stock
- **Live inventory status** updates
- **Immediate cart calculations**

### Error Handling
- **Comprehensive error middleware**
- **User-friendly error messages**
- **Transaction rollback** on failures

### Performance
- **Database query optimization**
- **Pagination** for large datasets
- **Efficient state management**

## 📊 Business Logic

### Inventory Management
- **Stock status calculation**: Normal/Low/Critical based on minStock
- **Automatic restocking** triggers
- **Inventory valuation** and reporting

### Menu Management
- **Ingredient requirement** tracking
- **Cost calculation** based on ingredient prices
- **Availability automation** based on stock levels

### Sales Processing
- **Tax calculation** (8% automatically applied)
- **Payment method** tracking
- **Receipt generation** with proper formatting

## 🔄 State Management

### React Hooks
- `useInventory` - Inventory state and operations
- `useMenus` - Menu state and operations
- `useCart` - Shopping cart management
- `useTransactions` - Transaction history

### API Integration
- **Centralized API service** with error handling
- **Loading state management**
- **Optimistic updates** for better UX

This system provides a complete solution for cafe and restaurant management, combining robust backend functionality with an intuitive frontend interface. The modular architecture allows for easy maintenance and future feature additions.