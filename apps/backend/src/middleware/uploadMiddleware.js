import multer from 'multer'; /// used for uploads managingg
import path from 'path';
import fs from 'fs'; /// used for file system uplaod
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/// to ensure that upload folder exists
const uploadsRoot = path.join(__dirname, '../../uploads');
const profilesDir = path.join(uploadsRoot, 'profiles');
const coversDir = path.join(uploadsRoot, 'covers');
const customContentDir = path.join(uploadsRoot, 'custom-content');
const receiptsDir = path.join(uploadsRoot, 'receipts'); // added receipts folder

// here creating folders if they don't exist
[uploadsRoot, profilesDir, coversDir, customContentDir, receiptsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Folder has been created:: ${dir}`);
    }
});

// this is for security to only accept images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Accept file
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// telling multer where and how to save profile upload pictures
const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, profilesDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname); // .jpg, .png ...
        const filename = 'profile-' + uniqueSuffix + fileExtension;
        cb(null, filename);
    }
});

// doing same for cover photos
const coverStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, coversDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        const filename = 'cover-' + uniqueSuffix + fileExtension;
        cb(null, filename);
    }
});

// creating a multer object for profile then for cover
const uploadProfile = multer({
    storage: profileStorage,
    limits: { fileSize: 2 * 1024 * 1024 }, // max 2 mb
    fileFilter: fileFilter
});

const uploadCover = multer({
    storage: coverStorage,
    limits: { fileSize: 4 * 1024 * 1024 }, //max 4 mb
    fileFilter: fileFilter
});

// and this is a multer to handle either a profile or cover or custom images
const uploadUserMedia = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            if (file.fieldname === 'profilePicture') {
                cb(null, profilesDir);
            } else if (file.fieldname === 'coverPhoto') {
                cb(null, coversDir);
            } else if (file.fieldname === 'receipt') { // added receipt support
                cb(null, receiptsDir);
            } else if (file.fieldname && file.fieldname.startsWith('customImage_')) {
                cb(null, customContentDir);
            } else {
                // For any other fields, put in root uploads folder
                cb(null, uploadsRoot);
            }
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const fileExtension = path.extname(file.originalname);
            
            if (file.fieldname === 'profilePicture') {
                cb(null, 'profile-' + uniqueSuffix + fileExtension);
            } else if (file.fieldname === 'coverPhoto') {
                cb(null, 'cover-' + uniqueSuffix + fileExtension);
            } else if (file.fieldname === 'receipt') { // added receipt support
                cb(null, 'receipt-' + uniqueSuffix + fileExtension);
            } else if (file.fieldname && file.fieldname.startsWith('customImage_')) {
                // Keep the original fieldname in the filename for reference
                const fieldName = file.fieldname.replace(/[^a-zA-Z0-9_]/g, '_');
                cb(null, `custom-${fieldName}-${uniqueSuffix}${fileExtension}`);
            } else {
                cb(null, 'file-' + uniqueSuffix + fileExtension);
            }
        }
    }),
    limits: { 
        fileSize: 4 * 1024 * 1024, // 4 mb max 
        files: 20 // Increase limit for custom content images
    },
    fileFilter: fileFilter
}).any(); // Use .any() to accept any field names

export { uploadProfile, uploadCover, uploadUserMedia };
