// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());

// Logger middleware - logs method, URL, and timestamp
app.use((req, res, next) => {
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${req.originalUrl}`);
  next(); // continue to the next handler
});

// Authentication middleware - check for API key in headers
const API_KEY = 'mysecretkey'; // You can change this key

app.use((req, res, next) => {
  const userKey = req.headers['x-api-key']; // Read the header key
  if (!userKey || userKey !== API_KEY) {
    return res.status(401).json({ message: 'Unauthorized: Invalid API Key' });
  }
  next(); // Continue to the next middleware or route
});

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});


// TODO: Implement the following routes:
// GET /api/products - Get all products
// GET /api/products/:id - Get a specific product
// POST /api/products - Create a new product
// PUT /api/products/:id - Update a product
// DELETE /api/products/:id - Delete a product

// Validation middleware - checks if product data is valid
function validateProduct(req, res, next) {
  const { name, description, price, category, inStock } = req.body;

  if (!name || !description || !price || !category || typeof inStock !== 'boolean') {
    return res.status(400).json({
      message: 'Invalid product data. Please provide all required fields.'
    });
  }

  next(); // continue to the next handler (e.g., POST or PUT)
}

// Get all products (with filtering, pagination, and search)
app.get('/api/products', (req, res) => {
  let { category, search, page = 1, limit = 5 } = req.query;

  // Convert limit and page to numbers
  page = parseInt(page);
  limit = parseInt(limit);

  let filteredProducts = [...products];

  // Filter by category if provided
  if (category) {
    filteredProducts = filteredProducts.filter(
      p => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Search by product name if provided
  if (search) {
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Pagination logic
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedProducts = filteredProducts.slice(start, end);

  res.json({
    total: filteredProducts.length,
    page,
    limit,
    products: paginatedProducts
  });
});

// Get a specific product by ID
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});
// Create a new product
app.post('/api/products', validateProduct, (req, res) => {
  const { name, description, price, category, inStock } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: 'Name and price are required.' });
  }

  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price,
    category,
    inStock
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});
// Update an existing product
app.put('/api/products/:id', validateProduct, (req, res) => {
  const { id } = req.params;
  const productIndex = products.findIndex(p => p.id === id);

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const updatedProduct = { ...products[productIndex], ...req.body };
  products[productIndex] = updatedProduct;

  res.json(updatedProduct);
});
// Delete a product
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const productIndex = products.findIndex(p => p.id === id);

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  products.splice(productIndex, 1);
  res.json({ message: 'Product deleted successfully' });
});

// Product statistics - count by category
app.get('/api/products/stats', (req, res) => {
  const stats = {};

  products.forEach(product => {
    if (!stats[product.category]) {
      stats[product.category] = 0;
    }
    stats[product.category]++;
  });

  res.json({
    totalProducts: products.length,
    categoryBreakdown: stats
  });
});

// TODO: Implement custom middleware for:
// - Request logging
// - Authentication
// - Error handling

// Custom Error Classes
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

// Example: Throwing errors inside routes (instead of res.status)
app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.name}: ${err.message}`);

  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500
      ? 'Internal Server Error — please try again later.'
      : err.message;

  res.status(statusCode).json({
    error: {
      type: err.name,
      message,
      status: statusCode,
      timestamp: new Date().toISOString()
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 