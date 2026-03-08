const jwt=require("jsonwebtoken");



function createTokenForUser(user){
const payload={
    id:user._id,
    fullName:user.fullName,
    email:user.email,
    ProfileImageUrl:user.ProfileImageUrl,
    role:user.role
}
const Token=jwt.sign(payload,secret)
return Token
}
function validateToken(token){
    const payload=jwt.verify(token,secret)
    return payload
}
module.exports={
    createTokenForUser,
    validateToken,
}