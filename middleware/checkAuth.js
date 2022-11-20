const JWT = require("jsonwebtoken");
const { MongoMissingCredentialsError } = require("mongodb");

module.exports = async (req, res, next) => {
    const token = req.header("x-auth-token");

    try {
        let user = await JWT.verify(token, process.env.SECRET_KEY);
        req.user = user.username;
    } catch (error) {
    }
    console.log("User Logged: ",req.user);
    next();
}
