const { Product } = require('../models');

class ProductController {
  // Create new product
  static createProduct(req, res) {
    const { name, description, price, user_id } = req.body;

    if (!name || !price || !user_id) {
      return res.status(400).json({ error: 'Name, price, and user_id are required' });
    }

    Product.create({ name, description, price, user_id }, (err, product) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json(product);
    });
  }

  // Get all products
  static getProducts(req, res) {
    Product.findAll((err, products) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(products);
    });
  }

  // Get product by ID
  static getProductById(req, res) {
    const { id } = req.params;

    Product.findById(id, (err, product) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    });
  }

  // Update product
  static updateProduct(req, res) {
    const { id } = req.params;
    const { name, description, price } = req.body;

    Product.update(id, { name, description, price }, (err, changes) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (changes === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ message: 'Product updated successfully' });
    });
  }

  // Delete product
  static deleteProduct(req, res) {
    const { id } = req.params;

    Product.delete(id, (err, changes) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (changes === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ message: 'Product deleted successfully' });
    });
  }
}

module.exports = ProductController;