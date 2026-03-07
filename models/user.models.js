const mongoose=require("mongoose");
const { createHmac } = require('crypto');
const { randomBytes } = require('crypto');
const {Schema,model}=require("mongoose");
const { createTokenForUser } = require("../services/authentication.js");

const userSchema=new Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    salt:{
        type:String,
    },
    Password:{
        type:String,
        required:true
    },
    ProfileImageUrl:{
        type:String,
        default:"/Images/default.png"
    },
    role:{
         type:String,
         enum:["User","Admin"],
         default:"User"
    },
},{timestamps:true})
userSchema.pre("save",function(next){
    const user=this;
    if(!user.isModified("Password")) return next();

    const salt=randomBytes(16).toString();
    const hashPassword=createHmac("sha256",salt)
    .update(user.Password)
    .digest("hex")
    this.salt=salt;
    this.Password=hashPassword;
    next();
})
userSchema.static("matchPasswordAndToken",async function(email,Password){
    const user=await this.findOne({email});
    if(!user) throw new Error("user not found")
    const salt=user.salt;
    const hashPassword=user.Password;   //hashed Password when user 
                                        //is stored in Db after signup
    const userPassword=createHmac("sha256",salt)
    .update(Password)       //login Password
    .digest("hex")
    if(hashPassword!=userPassword)throw new Error("Incorrect password")
    const token=createTokenForUser(user);
//way-1
   //return {...user,Password:undefined,salt:undefined} //instead of this we can do
 //way-2:
 //return user
 //way-3
 //return user._doc;
return token;
})
const User=mongoose.model("user",userSchema);
module.exports=User;