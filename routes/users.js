const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// GET /users - Get all users
router.get('/', UserController.getUsers);

// GET /users/:id - Get user by ID
router.get('/:id', UserController.getUserById);

// POST /users - Create new user
router.post('/', UserController.createUser);

// PUT /users/:id - Update user
router.put('/:id', UserController.updateUser);

// DELETE /users/:id - Delete user
router.delete('/:id', UserController.deleteUser);

module.exports = router;