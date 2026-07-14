"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../config/jwt");
const authenticate = async (req, res, next) => {
    const header = req.headers.authorization;
    const token = header?.split(" ")[1];
    console.log("req.body", req.body);
    if (!token) {
        return res.status(406).json({
            success: false,
            message: "Token is required"
        });
    }
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        req.body = req.body || {};
        req.body.role = decoded.role;
        req.body.id = decoded.id;
        // console.log("request's body", req.body);
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({
            success: false,
            message: "Token is expired or invalid"
        });
    }
};
exports.authenticate = authenticate;
