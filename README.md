🛍️ Product API – Express.js Project

🚀 Overview

This project is a RESTful API built with Express.js. It allows users to manage product data — including creating, reading, updating, deleting, filtering, paginating, and searching products.

It demonstrates the use of:

Routing and CRUD operations

Middleware (logging, authentication, validation, error handling)

Advanced query features (filtering, search, pagination)


📦 Project Structure

project/
│
├── server.js
├── routes/
│   └── productRoutes.js
├── middleware/
│   ├── logger.js
│   ├── authMiddleware.js
│   ├── validateProduct.js
│   └── errorHandler.js
├── controllers/
│   └── productController.js
├── models/
│   └── productModel.js
├── .env.example
└── README.md


⚙️ Setup Instructions

1️⃣ Prerequisites

Make sure you have Node.js (v18 or higher) and npm installed.

2️⃣ Install Dependencies

npm install express body-parser uuid dotenv

3️⃣ Environment Variables

Create a .env file (you can copy from .env.example) and include:

PORT=3000
API_KEY=your_api_key_here

4️⃣ Run the Server

node server.js

Your API should start on:

http://localhost:3000

You’ll see a message like:

Server running on port 3000...


🧪 API Documentation

Base URL

http://localhost:3000/api/products


1️⃣ GET /api/products

Retrieve all products, with optional filtering, search, and pagination.

Query Parameters

Parameter	Type	Description

category	string	Filter products by category
search	string	Search by product name
page	number	Page number for pagination
limit	number	Items per page


✅ Example Request

GET /api/products?category=Electronics&page=1&limit=5

✅ Example Response

{
  "status": "success",
  "results": 2,
  "data": {
    "products": [
      {
        "id": "1",
        "name": "Smartphone",
        "price": 450,
        "category": "Electronics",
        "inStock": true
      }
    ]
  }
}


2️⃣ GET /api/products/:id

Retrieve a single product by its ID.

✅ Example

GET /api/products/1234

✅ Response

{
  "id": "1234",
  "name": "Smartphone",
  "price": 450,
  "category": "Electronics",
  "inStock": true
}


3️⃣ POST /api/products

Create a new product.
🔐 Requires x-api-key header for authentication.

✅ Headers

x-api-key: your_api_key_here
Content-Type: application/json

✅ Body

{
  "name": "Laptop",
  "description": "A high-performance laptop",
  "price": 1200,
  "category": "Electronics",
  "inStock": true
}

✅ Response

{
  "status": "success",
  "message": "Product created successfully",
  "data": { ... }
}


4️⃣ PUT /api/products/:id

Update an existing product.
🔐 Requires x-api-key.

✅ Example

PUT /api/products/1234

✅ Body

{
  "price": 1300,
  "inStock": false
}

✅ Response

{
  "status": "success",
  "message": "Product updated successfully",
  "data": { ... }
}


5️⃣ DELETE /api/products/:id

Delete a product by ID.
🔐 Requires x-api-key.

✅ Response

{
  "status": "success",
  "message": "Product deleted successfully"
}


🧩 Middleware Implemented

Middleware	Purpose

logger.js	Logs request method, URL, and timestamp
authMiddleware.js	Checks for API key in headers
validateProduct.js	Validates product fields before creating/updating
errorHandler.js	Handles errors globally with custom messages & status codes


⚠️ Error Handling

Error Type	Example	Status Code

Validation Error	Missing name or price	400
Not Found Error	Product not found	404
Authentication Error	Missing/Invalid API key	401
Server Error	Unexpected internal issue	500


🧠 Advanced Features

Filtering → /api/products?category=Electronics

Search → /api/products?search=phone

Pagination → /api/products?page=2&limit=5

Statistics → /api/products/stats (count products by category)


🧰 Example Environment File (.env.example)

PORT=3000
API_KEY=mysecretapikey
