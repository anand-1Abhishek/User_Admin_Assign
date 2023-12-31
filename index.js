const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./config/db.js');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const formidable = require('express-formidable')
var multer = require('multer')
var morgan =require('morgan');
var upload = multer();


const app = express();
dotenv.config();
connectDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

app.use(formidable());
morgan('tiny')




app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
