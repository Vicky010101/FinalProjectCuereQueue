const jwt = require("jsonwebtoken");

function auth(req, res, next) {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    try {
        const jwtSecret = process.env.JWT_SECRET || "dev_jwt_secret_change_me";
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded; // includes id + role
        next();
    } catch (err) {
        res.status(401).json({ msg: "Token is not valid" });
    }
}

function roleCheck(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ msg: "Access denied" });
        }
        next();
    };
}

module.exports = { auth, roleCheck };
