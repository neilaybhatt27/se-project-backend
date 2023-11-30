const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.authenticate = (req, res, next) => {
    const token = req.header("Auth-Token");
    if(!token) {
        return res.status(500).send("Access Denied!");
    }

    jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
        if(err){
            return res.send(err);
        }
        req.user = user;
        next();
    });
};
