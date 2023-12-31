const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');


const saltRounds = 7;
dotenv.config();
secretKey=process.env.JWT_SECRET;

exports.createAdmin = async (req, res) => {
    try {
        const { name, email, phone_number, password } = req.fields;

        const profile_image = req.files.profile_image.path;
        const cloudinaryUpload = await cloudinary.uploader.upload(profile_image);
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newAdmin = new User({
            name,
            email,
            phone_number,
            profile_image,
            password: hashedPassword,
            isAdmin: 1,
            profile_image: cloudinaryUpload.secure_url
        });

        const savedAdmin = await newAdmin.save();

        res.status(201).json({ message: 'Admin created successfully', admin: savedAdmin });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.fields;

        const user = await User.findOne({ email });

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '5h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

exports.updateAdmin = async (req, res) => {
    try {
        const {  name, email, phone_number, password } = req.fields;
        const adminId = req.user._id;
        const profile_image = req.files?.profile_image?.path;
        await User.findByIdAndUpdate(adminId, { name, email, phone_number });

        //const cloudinaryUpload = await cloudinary.uploader.upload(profile_image);

        //User.profile_image = cloudinaryUpload.secure_url;

        // If password is provided, update it
        // if (password) {
        //     const hashedPassword = await bcrypt.hash(password, saltRounds);
        //     await User.findByIdAndUpdate(adminId, { password: hashedPassword });
        // }

        if((name||email||phone_number) && profile_image){
            const cloudinaryUpload = await cloudinary.uploader.upload(profile_image);
            await User.findByIdAndUpdate(adminId,{name : name,email:email,phone_number:phone_number , profile_image  : cloudinaryUpload.secure_url});
        }

        else if(name||email||phone_number){
            await User.findByIdAndUpdate(adminId,{name : name,email:email,phone_number:phone_number });
        }
        else if(profile_image) {
            const cloudinaryUpload = await cloudinary.uploader.upload(profile_image);
            await User.findByIdAndUpdate(adminId,{ profile_image  : cloudinaryUpload.secure_url});
        }
        else{
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            await User.findByIdAndUpdate(adminId, { password: hashedPassword });
        }

        const updatedUser = await User.findById(adminId);
        // updatedUser = await User.save();

        res.status(200).json({ message: 'User updated by admin successfully', user: updatedUser });
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
        const adminId  = req.user._id;
        if (!adminId) {
            return res.status(403).json({ error: 'Permission denied. Only admins can perform this action.' });
        }

        const userId = req.params.id;
        const {  name, email, phone_number, password } = req.fields;
        const profile_image = req.files?.profile_image?.path;
        await User.findByIdAndUpdate(userId, { name, email, phone_number });

        if((name||email||phone_number) && profile_image){
            const cloudinaryUpload = await cloudinary.uploader.upload(profile_image);
            await User.findByIdAndUpdate(userId,{name : name,email:email,phone_number:phone_number , profile_image  : cloudinaryUpload.secure_url});
        }

        else if(name||email||phone_number){
            await User.findByIdAndUpdate(userId,{name : name,email:email,phone_number:phone_number });
        }
        else if(profile_image) {
            const cloudinaryUpload = await cloudinary.uploader.upload(profile_image);
            await User.findByIdAndUpdate(userId,{ profile_image  : cloudinaryUpload.secure_url});
        }
        else{
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            await User.findByIdAndUpdate(userId, { password: hashedPassword });
        }

        const updatedUser = await User.findById(userId);


        res.status(200).json({ message: 'User updated by admin successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

exports.deleteUserByAdmin = async (req, res) => {
    try {
        const adminId  = req.user._id;
        if (!adminId) {
            return res.status(403).json({ error: 'Permission denied. Only admins can perform this action.' });
        }

        const userId = req.params.id;
        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: 'User deleted by admin successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

exports.deleteAdmin = async (req, res) => {
    try {
        const  adminId  = req.user._id;

        await User.findByIdAndDelete(adminId);

        res.status(200).json({ message: 'admin deleted  successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

