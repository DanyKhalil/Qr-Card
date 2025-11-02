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
// here creating fodlers if they dont exist
[uploadsRoot, profilesDir, coversDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Folder has been created:: ${dir}`);
    }
});

// telling multer where and how to save profile upload picturess
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

// this is for security to only accept images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Accept file
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

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



// and this is a multer to handle either a profile or cover 
const uploadUserMedia = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            if (file.fieldname === 'profilePicture') {
                cb(null, profilesDir);
            } else if (file.fieldname === 'coverPhoto') {
                cb(null, coversDir);
            } else {
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
            } else {
                cb(null, 'file-' + uniqueSuffix + fileExtension);
            }
        }
    }),
    limits: { 
        fileSize: 4 * 1024 * 1024, // 4 mb max 
        files: 2 // 2 files max
    },
    fileFilter: fileFilter
}).fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'coverPhoto', maxCount: 1 }
]);

export { uploadProfile, uploadCover, uploadUserMedia };