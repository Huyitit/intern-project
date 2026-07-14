"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCsvMiddleware = exports.uploadCsvMiddleware = exports.uploadAvatarMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const prisma_1 = __importDefault(require("../config/prisma"));
// Ensure upload directory exists
const uploadDir = path_1.default.join(__dirname, "../../public/uploads/avatars");
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, `avatar-${uniqueSuffix}${ext}`);
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    }
    else {
        cb(new Error("Not an image! Please upload an image."));
    }
};
exports.uploadAvatarMiddleware = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});
const csvUploadDir = path_1.default.join(__dirname, "../../public/uploads/csv");
if (!fs_1.default.existsSync(csvUploadDir)) {
    fs_1.default.mkdirSync(csvUploadDir, { recursive: true });
}
const csvStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, csvUploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `profile-${uniqueSuffix}.csv`);
    },
});
const csvFileFilter = (req, file, cb) => {
    if (file.mimetype === "text/csv" || file.originalname.endsWith('.csv')) {
        cb(null, true);
    }
    else {
        cb(new Error("Not a CSV file! Please upload a CSV."));
    }
};
exports.uploadCsvMiddleware = (0, multer_1.default)({
    storage: csvStorage,
    fileFilter: csvFileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit
    },
});
const parseCsvMiddleware = async (req, res, next) => {
    if (!req.file) {
        return res.status(406).json({ success: false, message: "No CSV file uploaded." });
    }
    try {
        const fileContent = fs_1.default.readFileSync(req.file.path, 'utf-8');
        const lines = fileContent.split(/\r?\n/).filter(line => line.trim() !== "");
        if (lines.length < 2) {
            return res.status(406).json({ success: false, message: "CSV file must contain a header row and at least one data row." });
        }
        const headers = lines[0].split(',').map(h => h.trim());
        // Expected headers exactly as requested
        const expectedHeaders = ['full_name', 'username', 'phone', 'email'];
        const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
        if (missingHeaders.length > 0) {
            return res.status(406).json({
                success: false,
                message: `CSV is missing required headers: ${missingHeaders.join(', ')}. Expected headers: full_name,username,phone,email`
            });
        }
        const values = lines[1].split(',').map(v => v.trim());
        const parsedData = {};
        headers.forEach((header, index) => {
            if (expectedHeaders.includes(header)) {
                const val = values[index];
                // Ignore empty/missing values so they don't overwrite DB
                if (val !== undefined && val !== "") {
                    parsedData[header] = val;
                }
            }
        });
        // Fetch existing user to merge data so it passes strict validation
        const userId = Number(req.params.id);
        const existingUser = await prisma_1.default.users.findUnique({
            where: { id: userId }
        });
        if (!existingUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        // Merge existing user data with CSV data
        const mergedUser = {
            id: existingUser.id,
            full_name: parsedData.full_name || existingUser.full_name,
            username: parsedData.username || existingUser.username,
            phone: parsedData.phone || existingUser.phone,
            email: parsedData.email || existingUser.email,
            role: existingUser.role, // role not updated via CSV
        };
        req.body.user = mergedUser;
        next();
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
exports.parseCsvMiddleware = parseCsvMiddleware;
