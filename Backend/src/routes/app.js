const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('../../../config');
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')


const port = process.env.PORT || 8080;
const app = express();
const mongoURI = config.mongoURI;
const sec = '47qc65noqieal674tinsxjknfakqwjr;odkw589p8'

app.use(cookieParser())
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect(mongoURI,) // Corrected dbName option
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    credentials: true // Enable credentials (cookies, authorization headers, etc.)
  }));

  const salt = bcrypt.genSaltSync(10)












app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.post('/login',async (req,res)=>{
    const {username, password} = req.body;
    try {
        const user = await User.findOne({username})
        if(!user){
            console.log('User not found');
        }
        const validatePassword = await bcrypt.compare(password,user.password)
        if(validatePassword){
            jwt.sign({username,id:user._id}, sec, {}, (err,token)=>{
                if(err) throw(err)
                res.cookie('token',token).json({
                    id : user._id,
                    username,
                })
            })
            console.log('logged in')
        }
    } catch (error) {
        console.log(error)        
    }

})

app.post('/signup', async (req, res) => {
    console.log("into signup");
    const { email, username, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await User.create({
        username: username,
        password: hashedPassword,
        email: email
      });
      console.log(user);
      res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error creating user', error: error.message });
    }
})


app.post('/logout',(req,res)=>{
    res.cookie('token','').json('ok')
})




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
