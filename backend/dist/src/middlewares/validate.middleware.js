"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => (req, res, next) => {
    // validate input
    const result = schema.safeParse({
        body: req.body,
        params: req.params,
        query: req.query
    });
    if (!result.success) {
        return res.status(400).json({
            success: false,
            message: "invalid input",
            errors: result.error.issues.map((i) => ({
                error_message: i.message,
                code: i.code
            }))
        });
    }
    next();
};
exports.validate = validate;
