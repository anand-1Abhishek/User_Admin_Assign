const express = require('express');
const router = express.Router();
const {register,login,updateUser,deleteUser} = require('../controller/userController.js');
const verifyToken = require('../middlewares/authMiddleware.js');

router.post('/register', register);
router.post('/login', login);
router.put('/update', verifyToken, updateUser);
router.delete('/delete', verifyToken, deleteUser);

module.exports = router;
