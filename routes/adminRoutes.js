const express = require('express');
const router = express.Router();
const {createAdmin,updateAdmin,getAllUsers,updateUserByAdmin,deleteUserByAdmin, loginAdmin, deleteAdmin} = require('../controller/adminController.js');
const verifyToken = require('../middlewares/authMiddleware');

router.post('/create-admin', createAdmin);
router.post('/login', loginAdmin);
router.put('/update-admin', verifyToken, updateAdmin);
router.get('/get-all-users', verifyToken,getAllUsers);
router.put('/update-user/:id', verifyToken, updateUserByAdmin);
router.delete('/delete-user/:id', verifyToken, deleteUserByAdmin);
router.delete('/delete-admin', verifyToken, deleteAdmin);

module.exports = router;
