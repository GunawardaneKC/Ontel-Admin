require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');

const PORT = 5000;
const DB_URL = process.env.MONGODB_URL;

const app = express();

// Enable CORS middleware for each set of routes
app.use('/user', cors(), require('./routes/userRouter'));
app.use('/api', cors(), require('./routes/categoryRouter'));
app.use('/api', cors(), require('./routes/upload'));
app.use('/api', cors(), require('./routes/productRouter'));
app.use('/api', cors(), require('./routes/paymentRouter'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true
}));

// Connect to MongoDB with additional options
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(() => {
    console.log('DB Connected');
})
.catch((err) => console.log('DB connection error', err));

app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});
