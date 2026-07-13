import multer from "multer";
import path from "path";
import fs from "fs";

import { Request, Response, NextFunction } from "express";
import prisma from "../../config/prisma";

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../../public/uploads/avatars");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload an image."));
  }
};

export const uploadAvatarMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

const csvUploadDir = path.join(__dirname, "../../public/uploads/csv");
if (!fs.existsSync(csvUploadDir)) {
  fs.mkdirSync(csvUploadDir, { recursive: true });
}

const csvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, csvUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `profile-${uniqueSuffix}.csv`);
  },
});

const csvFileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype === "text/csv" || file.originalname.endsWith('.csv')) {
    cb(null, true);
  } else {
    cb(new Error("Not a CSV file! Please upload a CSV."));
  }
};

export const uploadCsvMiddleware = multer({
  storage: csvStorage,
  fileFilter: csvFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
});



export const parseCsvMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return res.status(406).json({ success: false, message: "No CSV file uploaded." });
  }

  try {
    const fileContent = fs.readFileSync(req.file.path, 'utf-8');
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
    
    const parsedData: Record<string, any> = {};
    
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
    const existingUser = await prisma.users.findUnique({
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
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
