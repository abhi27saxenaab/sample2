const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');

// GET /products - Get all products
router.get('/', ProductController.getProducts);

// GET /products/:id - Get product by ID
router.get('/:id', ProductController.getProductById);

// POST /products - Create new product
router.post('/', ProductController.createProduct);

// PUT /products/:id - Update product
router.put('/:id', ProductController.updateProduct);

// DELETE /products/:id - Delete product
router.delete('/:id', ProductController.deleteProduct);

module.exports = router;