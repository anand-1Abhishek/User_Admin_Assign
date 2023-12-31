const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
const User = require('../model/user.js');


dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

secretKey=process.env.JWT_SECRET;

const saltRounds = 7;

exports.register = async (req, res) => {
    try {
        // console.log(req);
        const { name, email, phone_number, password } = req.fields;
        const profile_image = req.files.profile_image.path;
        const cloudinaryUpload = await cloudinary.uploader.upload(profile_image);

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            name,
            email,
            phone_number,
            password: hashedPassword,
            profile_image: cloudinaryUpload.secure_url
        });

        const savedUser = await newUser.save();
        
        res.status(201).json({ message: 'User registered successfully', user: savedUser });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

exports.login = async (req, res) => {
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

exports.updateUser = async (req, res) => {
    try {
        const { name } = req.fields;
        const userId = req.user._id;
        //console.log(userId);
        const profile_image = req.files?.profile_image?.path;
        //console.log(name)
        // Update name
        if(name && profile_image){
            const cloudinaryUpload = await cloudinary.uploader.upload(profile_image);
            await User.findByIdAndUpdate(userId,{name : name , profile_image  : cloudinaryUpload.secure_url});
        }

        else if(name){
            await User.findByIdAndUpdate(userId,{name : name});
        }
        else {
            const cloudinaryUpload = await cloudinary.uploader.upload(profile_image);
            await User.findByIdAndUpdate(userId,{ profile_image  : cloudinaryUpload.secure_url});
        }
        
        //User.profile_image = cloudinaryUpload.secure_url;
        

        // const updatedUser = await User.save();

        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.user._id;

        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};
