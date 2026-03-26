// const jwt=require("jsonwebtoken");

// const secret = process.env.JWT_SECRET;

// function createTokenForUser(user){
// const payload={
//     id:user._id,
//     fullName:user.fullName,
//     email:user.email,
//     ProfileImageUrl:user.ProfileImageUrl,
//     role:user.role
// }
// const Token=jwt.sign(payload,secret)
// return Token
// }
// function validateToken(token){
//     const payload=jwt.verify(token,secret)
//     return payload
// }
// module.exports={
//     createTokenForUser,
//     validateToken,
// }

require("dotenv").config();
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;

function createTokenForUser(user){
    const payload = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        ProfileImageUrl: user.ProfileImageUrl,
        role: user.role
    };

    const token = jwt.sign(payload, secret);
    return token;
}

function validateToken(token){
    const payload = jwt.verify(token, secret);
    return payload;
}

module.exports = {
    createTokenForUser,
    validateToken,
};