const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const dotenv = require('dotenv');


const saltRounds = 7;
dotenv.config();
secretKey=process.env.JWT_SECRET;

exports.createAdmin = async (req, res) => {
    try {
        const { name, email, phone_number, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const profile_image = req.file.path;
        const cloudinaryUpload = await cloudinary.uploader.upload(profile_image);

        const newAdmin = new User({
            name,
            email,
            phone_number,
            profile_image,
            password: hashedPassword,
            isAdmin: true,
            profile_image: cloudinaryUpload.secure_url
        });

        const savedAdmin = await newAdmin.save();

        res.status(201).json({ message: 'Admin created successfully', admin: savedAdmin });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

exports.updateAdmin = async (req, res) => {
    try {
        const { name, email, phone_number, password } = req.body;
        const profile_image = req.file.path;
        const adminId = req.user.userId;

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const updatedAdmin = await User.findByIdAndUpdate(adminId, {
            name,
            email,
            phone_number,
            password: hashedPassword
        }, { new: true });

        const cloudinaryUpload = await cloudinary.uploader.upload(profile_image);

        User.profile_image = cloudinaryUpload.secure_url;

        updatedAdmin = await User.save()

        res.status(200).json({ message: 'Admin updated successfully', admin: updatedAdmin });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

exports.updateUserByAdmin = async (req, res) => {
    try {
        const { userId, name, email, phone_number, password } = req.body;

        const profile_image = req.file.path;
        await User.findByIdAndUpdate(userId, { name, email, phone_number });

        const cloudinaryUpload = await cloudinary.uploader.upload(profile_image);

        User.profile_image = cloudinaryUpload.secure_url;

        // If password is provided, update it
        if (password) {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            await User.findByIdAndUpdate(userId, { password: hashedPassword });
        }

        const updatedUser = await User.findById(userId);
         updatedUser = await User.save();

        res.status(200).json({ message: 'User updated by admin successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

exports.deleteUserByAdmin = async (req, res) => {
    try {
        const { userId } = req.body;

        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: 'User deleted by admin successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};
