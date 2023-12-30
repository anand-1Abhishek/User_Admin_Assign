const express = require('express');
const router = express.Router();
const {createAdmin,updateAdmin,getAllUsers,updateUserByAdmin,deleteUserByAdmin} = require('../controller/adminController.js');
const verifyToken = require('../middlewares/authMiddleware');

router.post('/create-admin', createAdmin);
router.put('/update-admin', verifyToken, updateAdmin);
router.get('/get-all-users', verifyToken,getAllUsers);
router.put('/update-user', verifyToken, updateUserByAdmin);
router.delete('/delete-user', verifyToken, deleteUserByAdmin);

module.exports = router;
