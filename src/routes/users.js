const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const UserController = require('../controllers/userController');

// Route for getting all users (GET request to '/users')
router.get('/', authMiddleware, UserController.getAllUsers);

// Route for getting a specific user by ID (GET request to '/users/:id')
router.get('/:id', authMiddleware, UserController.getUserById);

// Route for creating a new user (POST request to '/users')
router.post('/', authMiddleware, UserController.createUser);

// Route for updating a user (PUT request to '/users/:id')
router.put('/:id', authMiddleware, UserController.updateUser);

// Route for deleting a user (DELETE request to '/users/:id')
router.delete('/:id', authMiddleware, UserController.deleteUser);

module.exports = router;




// if i write /users,then it become /users/users,so don't write
// Route for getting all users (GET request to '/users')
// const express = require('express');
// const router = express.Router();
// const User = require('../modals/Users'); // Replace with your user model path

// router.get('/', async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// // Route for getting a specific user by ID (GET request to '/users/:id')
// router.get('/:id', async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.json(user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// // Route for creating a new user (POST request to '/users')
// router.post('/', async (req, res) => {
//   try {
//     console.log("post method triggered");
//     const newUser = new User(req.body); // Create a new user object from request body
//     const savedUser = await newUser.save();
//     res.status(201).json(savedUser); // Return status 201 (Created)
//   } catch (error) {
//     console.error(error);
//     if (error.name === 'ValidationError') { // Handle validation errors
//       res.status(400).json({ message: error.message });
//     } else {
//       res.status(500).json({ message: "Server Error" });
//     }
//   }
// });

// // Route for updating a user (PUT request to '/users/:id')
// router.put('/:id', async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const updates = req.body;
//     const options = { new: true }; // Return the updated user
//     const updatedUser = await User.findByIdAndUpdate(userId, updates, options);
//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.json(updatedUser);
//   } catch (error) {
//     console.error(error);
//     if (error.name === 'ValidationError') { // Handle validation errors
//       res.status(400).json({ message: error.message });
//     } else {
//       res.status(500).json({ message: "Server Error" });
//     }
//   }
// });

// // Route for deleting a user (DELETE request to '/users/:id')
// router.delete('/:id', async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const deletedUser = await User.findByIdAndDelete(userId);
//     if (!deletedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.json({ message: "User deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// module.exports = router;
