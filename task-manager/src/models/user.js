const mongoose = require('mongoose');
const validator = require('validator');  
const bcrypt = require('bcryptjs'); 

const userSchema = mongoose.Schema({ 
    name: {
        type: String,
        required: true,
        trim: true, 
    }, 
    email: {
        type: String,
        unique: true, 
        required: true,
        trim: true,
        lowercase: true, 
        validate(value) {
            if (!validator.isEmail(value)){
                throw new Error('Invalid email'); 
            }
        }
    }, 
    password :{
        type: String, 
        required: true, 
        minlength: 7, 
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')){
                throw new Error('Cannot have the word password in your password'); 
            }
        } 

    }, 
    age: {
        type: Number,
        default: 0, 
        validate(value){
            if (value < 0){
                throw new Error('Age cannot be negative'); 
            }
        }
    }
});

userSchema.statics.findByCredentials = async(email, password) =>{
    const user = await User.findOne({email}); 
    if (!user){
        throw new Error('Unable to login'); 
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch){
        throw new Error('Unable to login');  
    }
    // login was succesful 
    return user; 
}

// hash plain text password before saving
userSchema.pre('save', async function(next){
    const user = this; 

    if (user.isModified('password')) {
        
        user.password = await bcrypt.hash(user.password, 8); 
    }
    next(); 
}); 

const User = mongoose.model('User', userSchema); 
module.exports = User 