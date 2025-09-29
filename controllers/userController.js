const { User } = require('../models');

class UserController {
  // Create new user
  static createUser(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    User.create({ name, email, password }, (err, user) => {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json(user);
    });
  }

  // Get all users
  static getUsers(req, res) {
    User.findAll((err, users) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(users);
    });
  }

  // Get user by ID
  static getUserById(req, res) {
    const { id } = req.params;

    User.findById(id, (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    });
  }

  // Update user
  static updateUser(req, res) {
    const { id } = req.params;
    const { name, email } = req.body;

    User.update(id, { name, email }, (err, changes) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (changes === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'User updated successfully' });
    });
  }

  // Delete user
  static deleteUser(req, res) {
    const { id } = req.params;

    User.delete(id, (err, changes) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (changes === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    });
  }
}

module.exports = UserController;