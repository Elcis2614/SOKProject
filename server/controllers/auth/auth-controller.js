// server/controllers/auth/auth-controller.js 

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User')


// register
const registerUser = async(req, res) => {
    const {userName, email, password } = req.body;
    
    try{
        const checkUser = await User.findOne({ email });
        if(checkUser){
            return res.json({
                success: false,
                message: "User Already exists with the same email! Please try again"
            });
        }
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            userName, 
            email, 
            password: hashPassword,
    })
    
    await newUser.save()
    res.status(200).json({
        success: true,
        message: "Registration Successful",
    })
        
    } catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured",
        });
    }
    
}


// login
const loginUser = async(req, res) => {
    const { email, password} = req.body;
    
    try{ 
        const checkUser =await User.findOne({ email });
        if(!checkUser) return res.json({
            success : false,
            message : "User doesn't exists! Please register first"
        })
        
        const checkPasswordMatch = await bcrypt.compare(password, checkUser.password);
        if (!checkPasswordMatch)return res.json({
            success : false,
            message : "Incorrect Password! Please try again",
        });
        
        const token = jwt.sign({
            id: checkUser._id, 
            role : checkUser.role, 
            email : checkUser.email,
            userName : checkUser.userName,
            
        }, 'CLIENT_SECRET_KEY', {expiresIn : '120m'})
        
        res.cookie('token', token, {httpOnly: true, secure: false}).json({
            success: true,
            message: 'Logged in successfully',
            user : {
                email: checkUser.email,
                role : checkUser.role,
                id: checkUser._id,
                userName : checkUser.userName
            }
        
        })
        
    } catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured",
        });
    }
}


// logout 
const logoutUser = (req, res)=> {
    res.clearCookie('token').json({
        success: true,
        message: 'Logged out successfully!',
    })
}



// middleware
const authMiddleware = async(req, res, next) => {
    const token = req.cookies.token;  // Make sure the token is stored in cookies

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized user! Token is missing'
        });
    }

    try {
        const decoded = jwt.verify(token, 'CLIENT_SECRET_KEY');
        req.user = decoded;  // Attach decoded user to request
        next();  // Proceed if token is valid
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Session expired! Please log in again.',  // Notify the frontend
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Unauthorized user! Invalid token',
        });
    }
}

module.exports = { registerUser, loginUser, logoutUser, authMiddleware};