"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOwnerOrAdmin = exports.checkAdminRole = void 0;
const checkAdminRole = (req, res, next) => {
    if (!req.body.role) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
    const role = req.body.role;
    if (role === "admin") {
        return next();
    }
    return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action"
    });
};
exports.checkAdminRole = checkAdminRole;
const checkOwnerOrAdmin = (req, res, next) => {
    const { id } = req.params;
    const trueId = req.body.id;
    if (req.body.role === "admin" || Number(id) === trueId) {
        return next();
    }
    return res.status(403).json({
        success: false,
        message: "You do not have permission to update this profile"
    });
};
exports.checkOwnerOrAdmin = checkOwnerOrAdmin;
