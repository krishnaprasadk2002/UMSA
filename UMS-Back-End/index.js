const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors')
const UserRouter = require('./routes/userRoute.js');
const AdminRouter = require('./routes/adminRouter.js');
const path = require('path')


dotenv.config();
const app = express()
const port = process.env.PORT || 3000

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Connected to MongoDB');
})

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:4200' }));

app.get('/', (req, res) => {
    let data = "Welcome data";
    res.send(data);
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/user', UserRouter)
app.use('/admin', AdminRouter)


app.listen(port, () => {
    console.log('server running successfully')
})
